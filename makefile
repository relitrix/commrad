build-and-run:
	@docker compose down
	@docker image prune -f
	@docker compose up -d --build
	@docker attach trackcombot
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
