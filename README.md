## Getting Started

1. In Drupal you need to setup the commerce, commerce_api and decoupled_router module.
2. Apply this patch to the decoupled_router module for product path resolution: https://www.drupal.org/files/issues/2022-04-05/3116487-4_0.patch
3. The routes /react-bootcamp and /php-bootcamp are currently hardcoded in the frontend example.
4. Setup products including variations and set URL aliases these routes.
5. Set NEXT_PUBLIC_DRUPAL_BASE_URL in the .env.local to your Drupal installation.
6. Run `npm install` and `npm run dev` and go shopping! :D

This repository is part of a presentation from DrupalDevDays 2023 in Vienna.
https://ddd23.drupalcamp.at/commerce-decoupled-nextjs-and-commerceapi-module

Reach out to me on:
https://www.linkedin.com/in/david-peherstorfer
