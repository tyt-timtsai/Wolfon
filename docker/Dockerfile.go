FROM golang:1.19.0-alpine3.15

WORKDIR /code

CMD ["go", "run", "code.go"]