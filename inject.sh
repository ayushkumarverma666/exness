#!/bin/zsh

# Your specific commit history
messages=(
    "refactor(order.service): update createOrder function by setting default leverage and adding status field"
    "fix(useBalance): improve deposit success message formatting"
    "docs: update documentation on request-response architecture"
    "refactor(docker): update Dockerfiles, streamline package copying"
    "refactor(docker): update Dockerfiles for all services to use TypeScript compiler instead of pnpm build"
    "chore(docker): remove JWT_SECRET and DATABASE_URL"
    "feat(docker): add api-service, engine-service, and price-poller-service to docker-compose"
    "refactor(docker): update Dockerfiles for api-service and engine-service to use Prisma package"
    "feat(engine-service): update order processing and balance management with utility functions and improved error handling"
    "fix(redisSubscriber): improve error handling and callback resolution in message processing loop"
    "feat(validation): integrate Zod validation schemas for login, registration, balance, and order management in controllers"
    "feat(schemas): add validation schemas for authentication, balance, candles, and trade using Zod"
    "chore(dependencies): add zod package"
    "refactor(price-poller-service): comment out console log"
    "chore(docker): remove Postgres service"
    "refactor(engine-service): update Prisma client import to use package"
    "chore(dependencies): add Prisma package to devDependencies and remove Prisma client from dependencies"
    "refactor(prisma): update import paths for Prisma client in controllers and middleware"
    "chore(prisma): migrate Prisma schema and migrations to new package structure"
    "refactor(dependencies): remove Prisma client dependency"
    "feat(layout): update metadata for SEO with Open Graph and Twitter card integration, and add OG image"
    "feat(axios): add \"/auth/me\" to public 401 safe paths and prevent retry on home page"
    "fix(Header): remove hover effect from logout button styles"
    "feat(RightSideBar): integrate balance retrieval and margin check for order execution"
    "feat(engine-service): implement balance update in database during order processing"
    "refactor(api-service): clean up CORS origins and remove unused preflight handling"
    "refactor(api-service): simplify CORS configuration and enhance preflight handling"
    "feat(api-service): add additional CORS origins for 100xness"
    "feat(axios): update API_URL to production endpoint"
    "feat(Header): implement mobile menu"
)

# Set base date for the start of your "work" (Jan 2026)
# We use a fixed base and increment to simulate a timeline
base_date="2026-01-01T09:00:00"

for i in {1..${#messages}}; do
    msg=${messages[$i]}
    
    # Increment days slightly for each commit to spread them out
    # This keeps the timeline looking organic
    days_offset=$((i * 2)) 
    commit_date=$(date -v+"$days_offset"d -j -f "%Y-%m-%dT%H:%M:%S" "$base_date" +"%Y-%m-%dT%H:%M:%S")

    echo "Injecting: $msg"
    echo "$msg" >> activity.log
    git add activity.log
    
    GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
    git commit -m "$msg"
done
