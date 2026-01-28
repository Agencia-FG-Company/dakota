# Auth Utils

Esse componente exporta pequenos componentes para auxiliar na criação de um bloco de login.


## Configuration 

1. Adding the app as a theme dependency using `eplus-cli`  

```bash
eplus io add auth-utils

```

or do manually and add in the `manifest.json` file;

```json
{
  "{vendor}.auth-utils": "0.x"
}
```

2. Declaring the app's main block in a given theme template or inside another block from the theme.

## blocos 

| Block name   | descrição | 
|------------- | --------- | 
| `greeting`   | XXXX      |
| `logout`     | XXXX      |
| `login-link` | XXXX      |


### `greeting` props 

| Prop Name        | type      | descrição | Default Value         |
|----------------- | --------- | --------- | --------------------- |
| `unloggedText`   | `string`  | XXXX      | `Entrar / Cadastrar`  |
| `loggedText`     | `string`  | XXXX      | `Olá {user}`          |
| `markers`        | `array`   | XXXX      | `[]`                  |


### `login-link` props 

| Prop Name        | type         | descrição | Default Value         |
|----------------- | ------------ | --------- | --------------------- |
| `returnUrl`      | `string`     | XXXX      | ``                    |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).


| Css Handles     |
| --------------- |
| `linkContainer` |
| `label`         |
| `logoutLink`    |
| `text`          |