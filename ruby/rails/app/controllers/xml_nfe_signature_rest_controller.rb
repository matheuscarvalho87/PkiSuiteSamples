require 'rest_pki'

class XmlNfeSignatureRestController < ApplicationController


  # This action initiates a XML element signature using REST PKI and renders the signature page.
  def index
    # Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature elements and start the
    # signature process (see config/initializers/restpki.rb)
    signature_starter = RestPki::XmlElementSignatureStarter.new(get_rest_pki_client)

    # Set the signature policy
    signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::XML_ICPBR_NFE_PADRAO_NACIONAL

    # Set the security context to be used to determine trust in the certificate chain
    signature_starter.security_context_id = get_security_context_id

    # Set the XML to be signed, a sample Brazilian fiscal invoice pre-generated
    signature_starter.set_xml_tosign_from_path(get_sample_doc_path(:sample_nfe))

    # Set the ID of the element to be signed
    signature_starter.element_tosign_id = 'NFe35141214314050000662550010001084271182362300'

    # Call the :start_with_webpki method, which initiates the signature. This yields the token, a 43-character
    # case-sensitive URL-safe string, which identifies this signature process. We'll use this value to call the
    # sign_with_restpki method on the Web PKI component (see signature-form.js) and also to complete the signature
    # after the form is submitted (see method create below). This should not be mistaken with the
    # API access token.
    @token = signature_starter.start_with_webpki

    # The token acquired above can only be used for a single signature attempt. In order to retry the signature it
    # is necessary to get a new token. This can be a problem if the user uses the back button of the browser, since
    # the browser might show a cached page that we rendered previously, with a now stale token. To prevent this from
    # happening, we call the method set_expired_page_headers, located in application_helper.rb, which sets HTTP
    # headers to prevent caching of the page.
    set_expired_page_headers
  end

  # This action receives the form submission from the signature page. We'll call REST PKI to complete the signature.
  def action
    # Get the token for this signature (rendered in a hidden input field, see xml_element_signature/new.html.erb)
    token = params[:token]

    # Instantiate the XmlSignatureFinisher class, responsible for completing the signature
    # process (see config/initializers/restpki.rb)
    signature_finisher = RestPki::XmlSignatureFinisher.new(get_rest_pki_client)

    # Set the token
    signature_finisher.token = token

    # Call the finish method, which finalizes the signature process
    signed_bytes = signature_finisher.finish

    # Get information about the certificate used by the user to sign the file. This field can only be acquired after
    # calling the finish method.
    @signer_cert = signature_finisher.certificate_info

    # At this point, you'd typically store the signed XML on your database. For demonstration purposes, we'll
    # store the XML on a temporary folder publicly accessible and render a link to it.
    @signed_pdf = store(signed_bytes, 'xml')
  end
end
