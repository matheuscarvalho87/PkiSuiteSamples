class Config(object):
    DEBUG = False
    TESTING = False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT = False

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='qG4Zryr5NDREhWB0k0DytvStN4lj8m9E9OMKdoC4R8dsZqpsc3ARuxOH00V-SRtZqwLdQ5-4dUQgeGQGpDUTfKqe3PMOj64E4Vmr4INkY30FbmV031tcVIH-A3B5aVXtGALFoVuzhSdmSfDVZgJCR5SERaV0bKIk_dr1Klh3ORj--9RdIf99JVBk44qtJaWVcKlYu7TJ6vd2Zkbr8GpUZIL7W1vWmRecexAVcsQplPNcqicS82ueVUX0KBq_XvX4U4pDMeOnpr8dULb5SLVVK-oAZdaAuidn3whjmJKa5YBNKS7VkD8rKuRpTO7DNNA1ih0VllRRRL0iE3ycXcBRePte2oMHXnjaMBDBXiEXpN72_JP4BSYlsvncBki_4AxpNaBTARclY-0BsZ15sO7jTdOddyA5FPf3h22Pvrfq7NdCmt7WVI48EW-onfxxXd7th59OpW6DdMov2w93iHtbr5WS5Ilb0NFgZDYFKnPuEgx6nMKlWDBKiOGwwsuhG3_6AFzymw'
    # This is a TRIAL token. It will be expired at 28/02/2021.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT = 'https://pki.rest/'

    # --------------------------------------------------------------------------
    # Amplia
    # --------------------------------------------------------------------------

    # The CA's id that will be used to issue a certificate using Amplia. We
    # have configured to the sample CA from sample subscription for these
    # samples.
    AMPLIA_CA_ID = 'eaffa754-1fb5-474a-b9ef-efe43101e89f'

    # ========================================================
    #     >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
    # ========================================================
    AMPLIA_API_KEY = 'pki-suite-samples-01|a4815dce2a24b145a0dbcc50af13b91d8ae9cb45467176488ae1c30c353752f2'
    # This is a TRIAL API key to use Amplia. It will expire at 28/02/2021.
    # If the Amplia's samples do not work please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises" installation of
    # Amplia, fill the field below with the URL address of your REST PKI
    # installation (with the trailing '/' character).
    AMPLIA_ENDPOINT = 'https://amplia.lacunasoftware.com/'

    # --------------------------------------------------------------------------
    # PKI Express
    # --------------------------------------------------------------------------

    # List of custom trusted roots. In this sample, we will get the certificate
    # files on static/ folder.
    PKI_EXPRESS_TRUSTED_ROOTS = []

    # Offline mode. Set this, if you want PKI Express to run on offline mode.
    # This mode is useful when there is no network available.
    PKI_EXPRESS_OFFLINE = False

    # --------------------------------------------------------------------------
    # Web PKI
    # --------------------------------------------------------------------------
    WEB_PKI_LICENSE = None


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True

    # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
    TRUST_LACUNA_TEST_ROOT = True

    # --------------------------------------------------------------------------
    # IMPORTANT NOTICE: in production code, you should use HTTPS to communicate
    # with REST PKI, otherwise your API access token, as well as the documents
    # you sign, will be sent to REST PKI unencrypted.
    # --------------------------------------------------------------------------
    REST_PKI_ENDPOINT = 'http://pki.rest/'


class TestingConfig(Config):
    TESTING = True
