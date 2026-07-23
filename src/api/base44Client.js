const removedFeature = async () => {
  throw new Error(
    'Base44 has been removed from this project. Replace this call with Formspree or another service.'
  );
};

const entityHandler = {
  get() {
    return {
      create: removedFeature,
      update: removedFeature,
      delete: removedFeature,
      list: async () => [],
      filter: async () => [],
      get: async () => null,
    };
  },
};

export const base44 = {
  auth: {
    me: async () => null,
    logout: async () => null,
    isAuthenticated: async () => false,
    redirectToLogin: () => {
      console.info('Base44 login has been removed.');
    },
  },

  entities: new Proxy({}, entityHandler),

  integrations: {
    Core: {
      SendEmail: removedFeature,
      UploadFile: removedFeature,
      GenerateImage: removedFeature,
      InvokeLLM: removedFeature,
    },
  },
};

export default base44;