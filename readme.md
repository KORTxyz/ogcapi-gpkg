<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://kort.xyz">
    <img src="https://avatars.githubusercontent.com/u/34128814?s=400&u=1c88fc45c4b68be2855b3e3bcb3425102f3fe7f1&v=4" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">KORTxyz - ogcapi-gpkg</h3>

  <p align="center">
    Fastify routes that follows the OGC standard.
    <br />
    <a href="https://github.com/kortxyz/ogcapi-gpkg"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://kort.xyz">View Demo</a>
    ·
    <a href="https://github.com/kortxyz/ogcapi-gpkg/issues">Report Bug</a>
    ·
    <a href="https://github.com/kortxyz/ogcapi-gpkg/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
Add standardbased geospatial capabilites to you API. 


![Product Name Screen Shot](https://raw.githubusercontent.com/KORTxyz/ogcapi-gpkg/master/.readme/screenshot.jpg)



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how to use this Fastify plugin in your own project.


### Prerequisites

* Install fastify through npm 
  ```sh
  npm install fastify
  ```
### Installation

1. Install the plugin through npm
    ```sh
    npm install @kortxyz/ogcapi-gpkg
    ```
2. Create a index.js

    ```js
      import Fastify from 'fastify';
      import ogcapi from '@kortxyz/ogcapi-gpkg';

      const app = Fastify();

      app.register(ogcapi, {
        baseurl: process.env.BASEURL,
        gpkg: process.env.GPKG, 
        skipLandingpage: false
      });

      // Run the server!
      try {
        await fastify.listen({ port: 3000, host:'0.0.0.0' })
      } catch (err) {
        fastify.log.error(err)
        process.exit(1)
      }

    ```

3. Start the server
   ```sh
   node index.js
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## API

### Options

*@kortxyz/ogcapi* accepts the options object:

```js
{
  baseUrl: 'http://127.0.0.1:3000',
  gpkg: 'data/naturcenter.gpkg',
  skipLandingpage: true,
}
```
+ `prefix` (Default: "" ): Standard .
+ `baseUrl` (Default: `undefined`): baseurl for the links in the json responses, prefix are added automatically.
+ `gpkg` (Default: `generated.gpkg`): path to the OGC Geopackage used a datastore for this API
+ `skipLandingpage` (Default: `false`): skip creating a root landingpage. Fx if you are not giving the routes a prefix.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x]  OGC API - Common
  - [x] part 1: Core
- [ ] OGC API - Features
  - [x] part 1: Core
  - [ ] part 2: CRS by Reference
  - [x] part 3: Filtering
  - [x] part 4: Create, Replace, Update and Delete
  - [x] part 5: Schemas
  - [x] part 6: Property Selection
  - [ ] part 7: Geometry Simplification
- [x] OGC API - Tiles
  - [x] part 1: Core
- [x] OGC API - Styles
  - [x] part 1: Core
- [ ] OGC API - Maps
  - [ ] part 1: Core

See the [open issues](https://github.com/kortxyz/ogcapi-gpkg/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

KORTxyz [info@kort.xyz](mailto:info@kort.xyz)

Project Link: [https://github.com/kortxyz/ogcapi-gpkg](https://github.com/kortxyz/ogcapi-gpkg)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/kortxyz/ogcapi-gpkg.svg?style=for-the-badge
[contributors-url]: https://github.com/kortxyz/ogcapi-gpkg/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kortxyz/ogcapi-gpkg.svg?style=for-the-badge
[forks-url]: https://github.com/kortxyz/ogcapi-gpkg/network/members
[stars-shield]: https://img.shields.io/github/stars/kortxyz/ogcapi-gpkg.svg?style=for-the-badge
[stars-url]: https://github.com/kortxyz/ogcapi-gpkg/stargazers
[issues-shield]: https://img.shields.io/github/issues/kortxyz/ogcapi-gpkg.svg?style=for-the-badge
[issues-url]: https://github.com/kortxyz/ogcapi-gpkg/issues
[license-shield]: https://img.shields.io/github/license/kortxyz/ogcapi-gpkg.svg?style=for-the-badge
[license-url]: https://github.com/kortxyz/ogcapi-gpkg/blob/master/LICENSE.txt