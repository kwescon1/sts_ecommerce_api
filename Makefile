.ONESHELL:

# ANSI color codes variables
GREEN=\033[0;32m
RED=\033[0;31m
NC=\033[0m # No Color

# Define the default target
help: ## Print help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Define targets
setup: modify_permission create-env build up ## Setup project

modify_permission: ## Change file permissions for entrypoint
	@if chmod +x docker-files/node/entrypoint.sh; then \
		echo "$(GREEN)Entrypoint permissions modified successfully$(NC)"; \
	else \
		echo "$(RED)Failed to modify entrypoint permissions$(NC)"; \
	fi

create-env: ## Copy .env.example to .env if it doesn't exist
	@if [ ! -f ".env" ]; then \
		echo "Creating .env file."; \
		cp .env.example .env; \
	fi

up: ## Start containers in detached mode
	@docker-compose up -d

build: create-env ## Build defined images
	@docker-compose build --no-cache

force_start: ## Force a restart of defined services
	@docker-compose up -d --force-recreate

fresh: build force_start ## A fresh recreate of all containers

ps: ## Show containers
	@docker-compose ps

teardown: ## Tear down containers and remove volumes
	docker-compose down -v

shell: ## Access the shell of the ThisWeekInDuluth container
	@docker exec -it -u ubuntu STS_Ecommerce /bin/bash

logs: ## Follow logs from all containers
	@docker-compose logs -f


migrate: ## Migrate db schemas
	@docker exec -it -u ubuntu STS_Ecommerce /bin/bash -c "npx sequelize-cli db:migrate"

undo_migrate: ## Undo previous migration
	@docker exec -it -u ubuntu STS_Ecommerce /bin/bash -c "npx sequelize-cli db:migrate:undo"

seed: ## Seed data into db
	@docker exec -it -u ubuntu STS_Ecommerce /bin/bash -c "npx sequelize-cli db:seed:all"
