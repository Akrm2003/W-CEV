start:
	docker compose up -d

start-dev:
	docker compose up

stop:
	docker compose down

logs:
	docker compose logs -f

frontend:
	docker compose exec frontend /bin/sh

backend:
	docker compose exec backend /bin/sh

frontend-logs:
	docker compose logs -f frontend

backend-logs:
	docker compose logs -f backend

clean:
	docker compose down --volumes
	docker system prune -af