"use client";

import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useCandles } from "../../hooks/useMarket";
import { useOpenPositions } from "../../hooks/useAccount";
import { MARKET_BY_SYMBOL, type AssetSymbol } from "../../lib/markets";
import { marketStream } from "../../lib/stream";
import { fmtPrice } from "../../lib/format";
import type { Candle } from "../../lib/types";
import { cn } from "../../lib/cn";

const INTERVALS = [
  { value: "1m", seconds: 60 },
  { value: "5m", seconds: 300 },
  { value: "15m", seconds: 900 },
  { value: "1h", seconds: 3600 },
  { value: "4h", seconds: 14400 },
  { value: "1d", seconds: 86400 },
  { value: "1w", seconds: 604800 },
];

const UP = "#20c77f";
const DOWN = "#f2495c";

export function PriceChart({ symbol }: { symbol: AssetSymbol }) {
  const [interval, setChartInterval] = useState("15m");
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const lastRef = useRef<Candle | null>(null);
  const linesRef = useRef<IPriceLine[]>([]);
  const [legend, setLegend] = useState<Candle | null>(null);

  const { data: candles, isLoading, isError, refetch } = useCandles(symbol, interval);
  const { data: positions } = useOpenPositions();
  const dp = MARKET_BY_SYMBOL[symbol].priceDp;

  // Create the chart once.
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#10141b" },
        textColor: "#8b95a5",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: { vertLines: { color: "#161c26" }, horzLines: { color: "#161c26" } },
      crosshair: { mode: CrosshairMode.Normal },
      localization: { locale: "en-US" },
      rightPriceScale: { borderColor: "#1f2631" },
      timeScale: { borderColor: "#1f2631", timeVisible: true, secondsVisible: false, rightOffset: 6 },
    });
    const candle = chart.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderUpColor: UP,
      borderDownColor: DOWN,
      wickUpColor: UP,
      wickDownColor: DOWN,
    });
    const volume = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    chart.subscribeCrosshairMove((param) => {
      const d = param.seriesData.get(candle) as Candle | undefined;
      setLegend(d && "open" in d ? { ...d, volume: 0 } : null);
    });

    chartRef.current = chart;
    candleRef.current = candle;
    volumeRef.current = volume;
    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
      linesRef.current = [];
    };
  }, []);

  useEffect(() => {
    candleRef.current?.applyOptions({ priceFormat: { type: "price", precision: dp, minMove: 1 / 10 ** dp } });
  }, [dp]);

  // Load history.
  useEffect(() => {
    if (!candles || !candleRef.current || !volumeRef.current) return;
    candleRef.current.setData(candles.map((c) => ({ ...c, time: c.time as UTCTimestamp })));
    volumeRef.current.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? "rgba(32,199,127,0.35)" : "rgba(242,73,92,0.35)",
      }))
    );
    lastRef.current = candles.at(-1) ?? null;
    chartRef.current?.timeScale().scrollToRealTime();
  }, [candles]);

  // Stream live trades into the current candle.
  useEffect(() => {
    const seconds = INTERVALS.find((i) => i.value === interval)!.seconds;
    return marketStream.onTrade((s, trade) => {
      if (s !== symbol || !candleRef.current || !volumeRef.current) return;
      const bucket = Math.floor(trade.ts / 1000 / seconds) * seconds;
      const last = lastRef.current;
      if (last && bucket < last.time) return;
      const next: Candle =
        last && last.time === bucket
          ? {
              ...last,
              high: Math.max(last.high, trade.price),
              low: Math.min(last.low, trade.price),
              close: trade.price,
              volume: last.volume + trade.qty,
            }
          : { time: bucket, open: last?.close ?? trade.price, high: trade.price, low: trade.price, close: trade.price, volume: trade.qty };
      lastRef.current = next;
      candleRef.current.update({ ...next, time: next.time as UTCTimestamp });
      volumeRef.current.update({
        time: next.time as UTCTimestamp,
        value: next.volume,
        color: next.close >= next.open ? "rgba(32,199,127,0.35)" : "rgba(242,73,92,0.35)",
      });
    });
  }, [symbol, interval]);

  // Position lines: entry, take-profit, stop-loss and liquidation.
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;
    linesRef.current.forEach((l) => series.removePriceLine(l));
    linesRef.current = [];
    for (const p of positions ?? []) {
      if (p.asset !== symbol) continue;
      const add = (price: number | null, color: string, title: string, style = LineStyle.Solid) => {
        if (price == null) return;
        linesRef.current.push(
          series.createPriceLine({ price, color, title, lineWidth: 1, lineStyle: style, axisLabelVisible: true })
        );
      };
      add(p.openingPrice, "#5b82ff", `${p.side === "long" ? "Long" : "Short"} ${p.qty}`);
      add(p.takeProfit, UP, "TP", LineStyle.Dashed);
      add(p.stopLoss, DOWN, "SL", LineStyle.Dashed);
      add(p.liquidationPrice, "#f5a524", "Liq.", LineStyle.Dotted);
    }
  }, [positions, symbol, candles]);

  const shown = legend ?? lastRef.current;
  const change = shown ? ((shown.close - shown.open) / shown.open) * 100 : 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-line px-2">
        {INTERVALS.map((i) => (
          <button
            key={i.value}
            onClick={() => setChartInterval(i.value)}
            className={cn(
              "rounded px-2 py-1 font-mono text-xs",
              interval === i.value ? "bg-panel-2 text-fg" : "text-muted hover:text-fg"
            )}
          >
            {i.value}
          </button>
        ))}
        {shown && (
          <div className="ml-3 hidden gap-3 font-mono text-[11px] text-muted md:flex">
            <span>O <span className="text-fg">{fmtPrice(symbol, shown.open)}</span></span>
            <span>H <span className="text-fg">{fmtPrice(symbol, shown.high)}</span></span>
            <span>L <span className="text-fg">{fmtPrice(symbol, shown.low)}</span></span>
            <span>C <span className="text-fg">{fmtPrice(symbol, shown.close)}</span></span>
            <span className={change >= 0 ? "text-up" : "text-down"}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</span>
          </div>
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        <div ref={containerRef} className="absolute inset-0" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">Loading chart…</div>
        )}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-muted">
            Chart data is unavailable right now.
            <button onClick={() => refetch()} className="rounded-md border border-line-2 px-3 py-1.5 text-fg">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
