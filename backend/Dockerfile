# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install git for private dependencies (if any)
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod ./
COPY go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Expose port
EXPOSE 8080

# Command to run
CMD ["./main"]
