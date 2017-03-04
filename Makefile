.PHONY: all build push app api build-app build-api push-app push-api

all: build push
	@echo "Please refer to the README.md."

build: build-app build-api

push: push-app push-api

app: build-app push-app

api: build-api push-api

build-app: clean
	@echo "Building docker image..."
	cd app && docker build -t $(HUB_TAG)ngxr-app:$(IMG_TAG) .

push-app: build-app
	@echo "Uploading..."
	docker push $(HUB_TAG)ngxr-app:$(IMG_TAG)

build-api: clean
	@echo "Building docker image..."
	cd api && docker build -t $(HUB_TAG)ngxr-api:$(IMG_TAG) .

push-api: build-api
	@echo "Uploading..."
	docker push $(HUB_TAG)ngxr-api:$(IMG_TAG)
