FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/requirements.txt
COPY tools/entrypoint.sh /app/tools/entrypoint.sh

RUN chmod +x /app/tools/entrypoint.sh
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

EXPOSE 8000

ENTRYPOINT ["./tools/entrypoint.sh"]