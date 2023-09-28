**Question 1.1** donner la liste des en-têtes de la réponse HTTP du server
*    HTTP/1.1 200 OK 
*   Date: Thu, 28 Sep 2023 15:03:12 GMT 
*   Connection: keep-alive 
*   Keep-Alive: timeout=5 
*   Transfer-Encoding: chunked

**Question 1.2** donner la liste des en-têtes qui ont changé depuis la version précédente.

L'en-têtes qui à changé est .`Content-Type: application/json`

**Question 1.3** que contient la réponse reçue par le client ?

Elle ne contient rien étant donné que le ficher index.html n'existe pas

**Question 1.4** quelle est l'erreur affichée dans la console ? Retrouver sur <https://nodejs.org/api> le code d'erreur affiché.
```
[Error: ENOENT: no such file or directory, open 'C:\Users\Utilisateur\Desktop\TP5_DEVWEB\index.html'] {
  code: 'ENOENT',
  syscall: 'open',
  path: 'C:\\Users\\Utilisateur\\Desktop\\TP5_DEVWEB\\index.html'
}
```

ENOENT (No such file or directory) : Cette erreur est souvent soulevée par l'opération fs pour indiquer qu'un composant du 
chemin d'accès spécifié n'existe pas. Aucune entité (fichier ou répertoire) n'a pu être trouvée par le chemin donné.

Modifier la fonction `requestListener()` précédente pour que le client recoive une erreur 500 si `index.html` est introuvable en remplacant le callback de la méthode `Promise.catch()`.


Maintenant, renommer le fichier `__index.html` en `index.html` et tester à nouveau.  
**L'utilisateur reçoit une reponse**

**Question 1.5** donner le code de `requestListener()` modifié _avec gestion d'erreur_ en `async/await`.

```js
async function requestListener(_request, response) {
  try {
    const contents = await fs.readFile("index.html", "utf8");
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    return response.end(`${contents}`);
  } catch (error) {
    response.writeHead(500);
    response.end(`${error}}`);
  }
}
```

### Mode développement

Dans le dossier `devweb-tp5` exécuter les commandes suivantes :

- `npm install cross-env --save`
- `npm install nodemon --save-dev`

**Question 1.6** indiquer ce que cette commande a modifié dans votre projet.

Cette commande a ajouté un nouveau fichier json `package-lock.json` et a ajouté de nouveaux modules.

Exécuter `npm run http-dev`, visiter le site, puis _pendant que le serveur s'exécute_ modifier le fichier `server-http.mjs` en ajoutant la ligne `console.log("NODE_ENV =", process.env.NODE_ENV);`.
Enregistrer le fichier et vérifier qu'il y a eu rechargement automatique grâce à <https://nodemon.io/>.
Ensuite, faire la même chose avec la commande `npm run http-prod`.

**Question 1.7** quelles sont les différences entre les scripts `http-dev` et `http-prod` ?

Le script `http-dev` permet de relancer le serveur lorsqu l'on modifie est sauvergarde des fichier relié au projet.  
Le script `http-prod` permet de tester le rendu final est n'est pas sujet aux modifications.

### Gestion manuelle des routes

**Question 1.8** donner les codes HTTP reçus par votre navigateur pour chacune des quatre pages précédentes.

Teste des **routes**:

- `http://localhost:8000/index.html => 200`
- `http://localhost:8000/random.html => 200`
- `http://localhost:8000/ => 404`
- `http://localhost:8000/dont-exist => 404`

Maintenant, on veut ajouter une route `/random/:nb` où `:nb` est un paramètre entier avec le nombre d'entiers à générer. Ajouter cette route au `switch` et reprendre la page `random.html` pour générer autant de nombres qu'indiqué dans l'URL.

Pour cela, utiliser `request.url.split("/");` qui va décomposer le chemin demandé et faire le `switch` sur le premier niveau de l'arborescence. Faites en sorte que le `switch` traite `/index.html` et `/` de la même façon.

Fonction après modification:

```js
let nb = 1;
async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    let random_numbers = [];
    try {
        const contents = await fs.readFile("index.html", "utf8");
        switch (request.url.split("/")[1]) {
            case "random":
                response.writeHead(200);
                nb = request.url.split("/")[2];
                return response.end(`<html><p>Nouveau nb =${nb}</p></html>`);
            case "":
                response.writeHead(200);
                return response.end(contents);
            case "index.html":
                response.writeHead(200);
                return response.end(contents);
            case "random.html":
                response.writeHead(200);
                for (let i = 0; i < nb; i++) {
                    random_numbers.push(Math.floor(100 * Math.random()));
                }
                return response.end(`<html><p>${random_numbers}</p></html>`);
            default:
                response.writeHead(404);
                return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
    }
}
```
## Partie 2 : framework Express

**Question 2.1** donner les URL des documentations de chacun des modules installés par la commande précédente.
Voici la liste des documentations: 

Express : https://expressjs.com/en/5x/api.html  
Morgan : https://expressjs.com/en/resources/middleware/morgan.html  
loglevel : https://www.npmjs.com/package/loglevel  
http-errors : https://www.npmjs.com/package/http-errors  

```js
import express from "express";
import morgan from "morgan";

const host = "localhost";
const port = 8000;

const app = express();

app.get(["/", "/index.html"], async function (request, response, next) {
  response.sendFile("index.html", { root: "./" });
});

app.get("/random/:nb", async function (request, response, next) {
  const length = request.params.nb;
  const contents = Array.from({ length })
    .map((_) => `<li>${Math.floor(100 * Math.random())}</li>`)
    .join("\n");
  return response.send(`<html><ul>${contents}</ul></html>`);
});

app.listen(port, host);
```

**Question 2.2** vérifier que les trois routes fonctionnent.

- `http://localhost:8000/index.html => 200`
- `http://localhost:8000/random.html => 200`
- `http://localhost:8000/ => 200`

On peut constater que les routes fonctionnent.

**Question 2.3** lister les en-têtes des réponses fournies par Express. Lesquelles sont nouvelles par rapport au serveur HTTP ?

Les nouveaux headers:
```
X-Powered-By: Express 
Accept-Ranges: bytes 
Cache-Control: public, max-age=0 
ETag: W/"45-z9Q9hnxAqFWuhajnT/F6oMPuICM"
Content-Type: text/html; charset=UTF-8 
Content-Length: 69 
```

**Question 2.4** quand l'événement `listening` est-il déclenché ?

L'évenement est déclenché lorsque l'application se connecte au port et à l'address ip spécifié.  
Ici elle se déclenche quand elle se connecte au port 8000 et à l'ip 127.0.0.1.


**Question 2.5** indiquer quelle est l'option (activée par défaut) qui redirige `/` vers `/index.html` ?

Il s'agit l'option index :
app.use(express.static("static",{index:index.html}));

**Question 2.6** visiter la page d'accueil puis rafraichir (Ctrl+R) et _ensuite_ **forcer** le rafraichissement (Ctrl+Shift+R). Quels sont les codes HTTP sur le fichier `style.css` ? Justifier.

Lorsque que l'on rafrachit normalement (Ctrl+R) on reçoit un code http 304.  
Mais lorsque l'on force le rafraichissement (Ctrl+Shift+R) on reçoit un code http 200.  
Cela est dû au fait que le navigateur utilise le cache lors d'un rafraichissement normal, ainsi il n'a pas besoin de charger la page de nouveau à l'inverse du rafraichissement forcé.

#### Contenu de `views/random.ejs`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css" />
    <link rel="stylesheet" href="/style.css" />
    <title>Tutorial</title>
  </head>

  <body>
    <div class="center">
      <h1><%= welcome %></h1>
      <% numbers.forEach(element => { %>
      <code><%= element %></code>
      <% }) %>
    </div>
  </body>
</html>
```

### Gestion d'erreurs

On va maintenant vérifier que le paramètre `/random/:nb` est bien un nombre. Si ce n'est pas le cas, il faut retourner une erreur HTTP 400.
Pour cela, utiliser le module <https://github.com/jshttp/http-errors>

1. ajouter le module `http-errors` avec `npm`
2. ajouter le `import ... from ...` correspondant dans `server-express.mjs`
3. dans la toute `/random/:nb`, faites la vérification avec `const length = Number.parseInt(request.params.nb, 10);` puis `Number.isNaN(length)`, si le paramètre, n'est pas un nombre, produire une erreur 400 avec `next(createError(400));`

**Commit/push** dans votre dépot Git.

Avec cette solution, l'erreur n'est pas bien rendue sur le client car elle passe dans le **handler d'erreur par défaut d'Express**. De plus, quand on visite une page qui n'existe pas, par exemple `http://localhost:8000/javascript`, la 404 n'est pas terrible non plus.

Ajouter, _tout à la fin des routes_, juste avant `app.listen(port, host);`, deux nouvaux _handlers_ comme suit :

```js
app.use((request, response, next) => {
  concole.debug(`default route handler : ${request.url}`);
  return next(createError(404));
});

app.use((error, _request, response, _next) => {
  concole.debug(`default error handler: ${error}`);
  const status = error.status ?? 500;
  const stack = app.get("env") === "development" ? error.stack : "";
  const result = { code: status, message: error.message, stack };
  return response.render("error", result);
});
```

Ensuite, créer, sur le modèle de `random.ejs`, une vue `error.ejs` dont le corps est comme suit :

```html
<body>
  <div class="center">
    <h1>Error <%= code %></h1>
    <p><%= message %></p>
  </div>
  <% if (stack != null) { %>
  <pre><%= stack %></pre>
  <% } %>
</body>
```

**Question 2.7** vérifier que l'affichage change bien entre le mode _production_ et le mode _development_.

**Commit/push** dans votre dépot Git.

Enfin, chargez le module `loglevel` avec `import logger from "loglevel";` puis fixer un niveau de verbosité avec `logger.setLevel(logger.levels.DEBUG);`.

Remplacez tous les `console.log()` et variantes par `logger.error()`, `logger.warn()`, `logger.info()`, `logger.debug()` ou `logger.trace()` approprié.

Modifier le niveau de verbosité, par exemple `logger.setLevel(logger.levels.WARN);` et vérifier l'affichage.

**Commit/push** dans votre dépot Git.

## Conclusion

À ce stade du tutoriel, vous avez vues les principales étapes de la création d'une application Node.js/Express.
Ces étapes seront déjà réalisées dans le projet de départ du [TP6](../TP6).

