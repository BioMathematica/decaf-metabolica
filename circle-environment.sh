#!/usr/bin/env bash

# Export production or staging environment based on the branch we are building
if [ "${CIRCLE_BRANCH}" == "master" ]; then
  export ENVIRONMENT=prod
  export TRUSTED_URLS=${TRUSTED_URLS_PROD}
  export POTION_API_HOST=${POTION_API_HOST_PROD}
  export POTION_API_PREFIX=${POTION_API_PREFIX_PROD}
  export DECAF_API=${DECAF_API_PROD}
  export MODEL_API=${MODEL_API_PROD}
  export MODEL_WS_HOST=${MODEL_WS_HOST_PROD}
  export MODEL_WS_PREFIX=${MODEL_WS_PREFIX_PROD}
  export PATHWAYS_API=${PATHWAYS_API_PROD}
  export PATHWAYS_WS=${PATHWAYS_WS_PROD}
  export SENTRY_DSN=${SENTRY_DSN_PROD}
else
  export ENVIRONMENT=staging
  export TRUSTED_URLS=${TRUSTED_URLS_STAGING}
  export POTION_API_HOST=${POTION_API_HOST_STAGING}
  export POTION_API_PREFIX=${POTION_API_PREFIX_STAGING}
  export DECAF_API=${DECAF_API_STAGING}
  export MODEL_API=${MODEL_API_STAGING}
  export MODEL_WS_HOST=${MODEL_WS_HOST_STAGING}
  export MODEL_WS_PREFIX=${MODEL_WS_PREFIX_STAGING}
  export PATHWAYS_API=${PATHWAYS_API_STAGING}
  export PATHWAYS_WS=${PATHWAYS_WS_STAGING}
  export SENTRY_DSN=${SENTRY_DSN_STAGING}
fi

# Run the provided command with this environment
$@
