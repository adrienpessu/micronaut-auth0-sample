# Secure a Micronaut application with Auth0

Learn how to create a Micronaut application and secure it with an Authorization Server provided by Auth0.

You will need to have Java 11 installed

## Configure Auth0

To use Auth0 services, you’ll need to have an application set up in the Auth0 Dashboard. The Auth0 application is where you will configure how you want authentication to work for the project you are developing.

### Configure an application

Use the interactive selector to create a new Auth0 application or select an existing application that represents the project you want to integrate with. Every application in Auth0 is assigned an alphanumeric, unique client ID that your application code will use to call Auth0 APIs through the SDK.

Any settings you configure using this quickstart will automatically update for your Application in the [Dashboard](https://manage.auth0.com/dashboard/), which is where you can manage your Applications in the future.

If you would rather explore a complete configuration, you can view a sample application instead.

### Configure Callback URLs 

A callback URL is a URL in your application that you would like Auth0 to redirect users to after they have authenticated. If not set, users will not be returned to your application after they log in.

> If you are following along with our sample project, set this to http://localhost:8080/oauth/callback/auth0.

### Configure Logout URLs

A logout URL is a URL in your application that you would like Auth0 to redirect users to after they have logged out. If not set, users will not be able to log out from your application and will receive an error.

> If you are following along with our sample project, set this to http://localhost:8000.

## Configure Micronaut application

There are two easy ways to start a new Micronaut. You can generate the project on the [Micronaut launch](https://micronaut.io/launch/) website. 
> If you are following along with our sample project, don't forget to add the features : views-thymeleaf, security-oauth2 and security-jwt

The other easy way is the [Micronaut Command Line Interface](https://docs.micronaut.io/latest/guide/#cli) (You can install it using the awesome [Sdkman](https://sdkman.io/)) and the following command : 

`mn create-app example.micronaut --build=gradle --lang=java`

If you already have a Micronaut project, you have generated your project with Micronaut CLI or you haven't added the security features in Micronaut launch. You will need to add a few dependencies :

### Add dependencies

To use OAuth 2.0 integration, add the `micronaut-security-oauth2` dependency:

Also add Micronaut JWT support `micronaut-security-jwt` dependencies:

> This guide uses Thymeleaf and the Micronaut Security integration module for the view layer. If you are using a different view technology, the Micronaut security configuration and components remain the same.

If you are using Gradle, you can include these dependencies to your project
```groovy

dependencies {
    ...
    implementation("io.micronaut.security:micronaut-security-jwt")
    implementation("io.micronaut.security:micronaut-security-oauth2")
    ...
}
```

### Write your application

If you use IntelliJ IDEA, make sure to enable annotation processing.
![Annotation Processors](docs/annotationprocessorsintellij.png)

#### Configure Micronaut security

Add the following OAuth2 Configuration:

```
  security:
    authentication: idtoken 
    oauth2:
      clients:
        auth0: 
          client-id: '${OAUTH_CLIENT_ID}' 
          client-secret: '${OAUTH_CLIENT_SECRET}' 
          openid:
            issuer: 'https://${OAUTH_DOMAIN}/' 
    endpoints:
      logout:
        get-allowed: true 
```
In this configuration, you tell Micronaut security to rely on `idtoken`. 
We also specify to use the `client-id`, `client-secret` and `openid.issuer` provided in environment variables. Those settings will be found in your [Auth0 Dashboard](https://manage.auth0.com/dashboard/) (as mention above). Please note that the issuer is the Auth0 domain. (It looks like `xxx.eu.auth0.com`)

During the application startup, Micronaut security fetches the OpenId configuration from Auth0 (at `https://xxx.eu.auth0.com/.well-know/openid-configuration`) 

> Please do not hard code the `client-id`, `client-secret` and `openid.issuer`. You should use environment variables and / or [environment specific properties](https://docs.micronaut.io/latest/guide/#propertySource).

#### Add a Controller

Create a java file suffixed by `Controller` (`HomeController` for example). 
You can start this controller with the following content.

```java
@Controller
public class HomeController {

    @Secured(SecurityRule.IS_ANONYMOUS)
    @View("home") 
    @Get
    public HttpResponse<Map<String, Object>> index(@Nullable Authentication authentication) {

        HashMap<String, Object> variables = new HashMap<>();
        if (authentication != null) {
            variables.putAll(authentication.getAttributes());
        }

        return HttpResponse.ok(variables);
    }
}
```

The `@Controller` annotation tells Micronaut that this class is a controller.
The `@Secured(SecurityRule.IS_ANONYMOUS)` annotation tells Micronaut security to allow anonymous users (not logged in) to access this controller. Micronaut security allow us to restrict access to the application based on the authentication status but also on roles.
The `@View` annotation tells Micronaut View to load the view name `home` 
The `@Get` annotation tells Micronaut to respond to `GET` Http requests

The `index` method has one parameter called authentication. The `Authentication` object includes information about the current user (like information contained in the idtoken). We allow this parameter to be `null` for anonymous users. The instructions of this method take the `attributes` field of `authentication` and simply return it to the view. (You probably shouldn't do this in production for security reasons)

#### Add a View

Since you already specified in the controller that the view is named `home`, you have to create a file named `home.html`.
In that file, you will have all the HTML (maybe CSS and JavaScript) code that composed your page with Thymeleaf templating code. 

To display content whereas the user is connected or not, you can use the following Thymeleaf syntax and the variable `security` : 
```html
<a href="/oauth/login/auth0" class="btn btn-link" th:unless="${security}">Enter</a>
<a href="/oauth/logout" class="btn btn-link" th:if="${security}">Logout</a>
```

To display the user information that you returned in the controller, you can use the following code : 
```html
<pre class="code" data-lang="JSON">
    <code>{
        "aud": "<span th:text="${aud}"></span>",
        "email": "<span th:text="${email}"></span>",
        "email_verified": "<span th:text="${email_verified}"></span>",
        "exp": "<span th:text="${exp}"></span>",
        "family_name": "<span th:text="${family_name}"></span>",
        "given_name": "<span th:text="${given_name}"></span>",
        "iat": "<span th:text="${iat}"></span>",
        "iss": "<span th:text="${iss}"></span>",
        "locale": "<span th:text="${locale}"></span>",
        "picture": "<span th:text="${picture}"></span>",
        "name": "<span th:text="${name}"></span>",
        "nickname": "<span th:text="${nickname}"></span>",
        "nonce": "<span th:text="${nonce}"></span>",
        "updated_at": "<span th:text="${updated_at}"></span>",
        "sid": "<span th:text="${sid}"></span>",
        "sub": "<span th:text="${sub}"></span>",
    }</code>
</pre>
```

## Let's try it

Congratulation! Now that you have completed all this steps, you can run and test your application. 
> If you are using Gradle, run `./gradlew run`

## To go further

- [Micronaut documentation](https://docs.micronaut.io/latest/guide/)
- [Micronaut security documentation](https://micronaut-projects.github.io/micronaut-security/latest/guide/)

## Acknowledgement

Thanks to Sergio del Amo for the guide https://guides.micronaut.io/latest/micronaut-oauth2-auth0-gradle-java.html
