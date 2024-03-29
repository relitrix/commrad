build-and-run:
	@docker compose down
	@docker image prune -f
	@docker compose up -d --build
	@docker attach trackcombot
deploy:
	@docker-compose --context remote -f docker-compose-production.yml up -d --build
prod-stop:
	@docker-compose --context remote -f docker-compose-production.yml down
run:
	@docker compose down
	@docker compose up -d
	@docker attach trackcombot
stop:
	@docker compose down
push-vault:
	@npx dotenv-vault push
pull-vault:
	@npx dotenv-vault pull
open-vault:
	@npx dotenv-vault open
