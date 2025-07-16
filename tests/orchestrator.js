import retry from "async-retry";

const waitForAllServices = async () => {
  const fetchStatusPage = async (bail, tryNumber) => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    if (response.status !== 200) {
      throw Error();
    }
  };

  const waitForWebServer = async () => {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });
  };
  await waitForWebServer();
};

export default {
  waitForAllServices,
};
