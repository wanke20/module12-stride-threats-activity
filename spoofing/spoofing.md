# Spoofing

This example demonstrates spoofind through two ways -- Stealing cookies programmatically and cross site request forgery (CSRF).

## Steps to reproduce the vulnerability

1. Install dependencies

    `$ npx install`

2. Start the **insecure.ts** server

    `npx ts-node insecure.ts`

3. Start the malicious server **mal.ts**

    `npx ts-node mal.ts`

4. Open __http://localhost:8000__ in a browser, type a name and Submit.

5. Open the __Application__ tab in the Browser's inspect pane. Find the __Cookies__ under __Storage__. You should see a __connect.sid__ cookie being set.

6. Open the HTML file __mal-steal-cookie.html__ file in the same browser (different tab). Open inspect and view the console.

7. Click the link in the HTML file. Do you see the cookie being stolen in the console? Yes

8. Open the HTML file __mal-csrf.html__ file in the same browser (different tab). What do you see if the user has not logged out of **insecure.ts**? What do you see if the user has logged out? In both cases, the cookies are still preserved.


## For you to answer

1. Briefly explain the spoofing vulnerability in **insecure.ts**. 
secret: session secret is hardcoded in the source code
httpOnly: cookie has httpOnly: false, which determines whether client-side scripts can access the cookie's value
sameSite: cookie does not set sameSite: true, which determines how cookie can be sent with cross-site requests
2. Briefly explain different ways in which vulnerability can be exploited.
secret: with access to the soure code where secret is hardcoded, an attacker can create cookies that pass the secret verification check, allowing them to impersonate any user
httpOnly: if the attacker can somehow inject javascript into the site, they can steal the cookie and use them to impersonate the user
sameSite: the attacker can create requests from their site to the target server, which will send your cookies from your browser to verify your identity, allowing them to use your browser to perform actions
3. Briefly explain why **secure.ts** does not have the spoofing vulnerability in **insecure.ts**.
secret: secure.ts does not hardcode the secret by taking it from the program args
httpOnly: secure.ts sets httpOnly to true so the cookie can't be accessed with a script
sameSite: secure.ts sets sameSite to true so cookies can only be sent within the same site, thus requests can't be made cross-site.