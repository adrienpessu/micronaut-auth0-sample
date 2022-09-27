# Secure a Micronaut application with Auth0

Learn how to create a Micronaut application and secure it with an Authorization Server provided by Auth0.

You will need to have Java 17+ installed

## OAuth 2.0 [_oauth_2_0]

To provide authentication, sign in to your [Auth0](https://auth0.com) account.

Create an Application

![auth0 create application](docs/auth0-create-application.png)

Fill the Application URIs:

![auth0 application uris](docs/auth0-application-uris.png)

-   Enter `http://localhost:8080/oauth/callback/auth0` as callback URL.

-   Enter `http://localhost:8080/logout` as allowed logout URL.

-   Enter `http://localhost:8080` as allowed web origins.

Once you have an HTTPS domain (e.g. `https://myapp.org`), enter it as Application Login URI: `https://myapp.org/oauth/login/auth0`.

You can obtain the application’s domain, client id, and secret in the Auth0 console.

![auth0 clientid clientsecret](docs/auth0-clientid-clientsecret.png)

We want to use an **Authorization Code** grant type flow, which is described in the following diagram:

![diagramm](docs/diagramm.png)

common:create-app.adoc\[\]

### Dependencies [_dependencies]

To use OAuth 2.0 integration, add the following dependency:

dependency:micronaut-security-oauth2\[groupId=io.micronaut.security\]

Also add [Micronaut JWT support](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#jwt) dependencies:

dependency:micronaut-security-jwt\[groupId=io.micronaut.security\]

### Configuration [_configuration]

Add the following OAuth2 Configuration:

resource:application.yml\[tag=oauth2\]

callout:authentication-idtoken\[number=1,arg0=Auth0\] callout:oauth2-client-name\[number=2,arg0=auth0\] \<3\> Client ID. See previous screenshot. \<4\> Client Secret. See previous screenshot. \<5\> `issuer` URL. It allows the Micronaut framework to [discover the configuration of the OpenID Connect server](https://auth0.com/docs/configure/applications/configure-applications-with-oidc-discovery). Note: we will use the application’s domain. \<6\> Accept GET request to the `/logout` endpoint.

When you start the Micronaut application, it fetches the Auth0 application’s `openidconfiguration`:

``` bash
https://{auth0domain}/.well-known/openid-configuration
```

The previous configuration uses several placeholders. You will need to set up `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `OAUTH_DOMAIN` environment variables.

    export OAUTH_CLIENT_ID=XXXXXXXXXX
    export OAUTH_CLIENT_SECRET=YYYYYYYYYY
    export OAUTH_DOMAIN=micronautguides.eu.auth0.com

common:micronaut-views-thymeleaf.adoc\[\]

### Home controller [_home_controller]

Create a controller to handle the requests to `/`. You will display the email of the authenticated person if any. Annotate the controller endpoint with `@View`, since we will use a Thymeleaf template.

source:HomeController\[\]

callout:controller\[number=1,arg0=/\] callout:secured-anonymous\[number=2\] callout:view\[number=3\] callout:get\[number=4,arg0=index,arg1=/\]

### Thymeleaf template [_thymeleaf_template]

Create a Thymeleaf template:

resource:views/home.html\[\]

Also, note that we return an empty model in the controller. However, we are accessing `security` in the Thymeleaf template.

-   The [SecurityViewModelProcessor](https://micronaut-projects.github.io/micronaut-views/latest/api/io/micronaut/views/model/security/SecurityViewModelProcessor.html) injects into the model a `security` map with the authenticated user. See [User in a view](https://micronaut-projects.github.io/micronaut-views/latest/guide/#security-model-enhancement) documentation.

common:runapp.adoc\[\]

![auth0video](docs/auth0video.gif)

common:graal-with-plugins.adoc\[\]

:exclude-for-languages:groovy

After you execute the native executable, navigate to localhost:8080 and authenticate with Auth0.

## Next steps [_next_steps]

Read [Micronaut OAuth 2.0 documentation](https://micronaut-projects.github.io/micronaut-security/latest/guide/#oauth) to learn more.

common:helpWithMicronaut.adoc\[\]