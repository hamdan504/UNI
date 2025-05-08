terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "isimm_app" {
  name = "isimm_app"
  build {
    context = "${path.module}"
    dockerfile = "Dockerfile"  // Specify the Dockerfile path
  }
}

resource "docker_container" "isimm_app" {
  name  = "isimm_app"
  image = docker_image.isimm_app.image_id

  ports {
    internal = 3000  // Match your application port
    external = 3000
  }

  restart = "unless-stopped"  // Add restart policy
}