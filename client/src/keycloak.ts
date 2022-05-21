import Keycloak from "keycloak-js";

const keycloak = Keycloak({
  url: "http://localhost:8080/auth",
  realm: "CloudStorage",
  clientId: "cloud-storage-api",
});

export default keycloak;
