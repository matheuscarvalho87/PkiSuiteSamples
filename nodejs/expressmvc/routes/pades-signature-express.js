const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	PadesSignatureStarter,
	StandardSignaturePolicies,
	SignatureFinisher,
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-signature-express
 *
 * This route only renders the signature page.
 */
router.get('/', (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	res.render('pades-signature-express', { fileId });
});

/**
 * POST /pades-signature-express/start
 *
 * This route starts the signature. In this sample, it will be called
 * programatically after the user press the "Sign File" button (see method
 * readCertificate() on public/javascripts/signature-start-form.js).
 */
router.post('/start', (req, res, next) => {
	const { fileId } = req.query;

	// Recover variables from the POST arguments to be use don this step.
	const certThumb = req.body.certThumbField;
	const certContent = req.body.certContentField;

	// Get an instantiate of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new PadesSignatureStarter();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureStarter);

	// Set signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;

	// Set PDF to be signed.
	signatureStarter.setPdfToSignFromPathSync(StorageMock.getDataPath(fileId));

	// Set Base64-encoded certificate's content to signature starter.
	signatureStarter.setCertificateFromBase64Sync(certContent);

	// Set a file reference for the stamp file. Note that this file can be
	// referenced later by "fref://{alias}" at the "url" field on the
	// visual representation (see public/vr.json or
	// getVisualRepresentation() method).
	signatureStarter.addFileReferenceSync('stamp', StorageMock.getPdfStampPath());

	// Set the visual representation. We provided a dictionary that
	// represents the visual representation JSON model.
	signatureStarter
		.setVisualRepresentationSync(PadesVisualElementsExpress.getVisualRepresentation());

	// Start the signature process.
	signatureStarter.start()
		.then((response) => {
			// Receive as response the following fields:
			// - toSignHash: The hash to be signed.
			// - digestAlgorithm: The digest algorithm that will inform the Web PKI
			//                    component to compute this signature.
			// - transferFile: A temporary file to be passed to "complete" step.
			const { toSignHash } = response;
			const { digestAlgorithm } = response;
			const { transferFile } = response;

			// Render the field from start() method as hidden field to be used on
			// the javascript or on the "complete" step.
			res.render('pades-signature-express/start', {
				toSignHash,
				digestAlgorithm,
				transferFile,
				certThumb,
				fileId,
			});
		}).catch((err) => next(err));
});

/**
 * POST pades-signature-express/complete
 *
 * This route completes the signature, it will be called programatically after
 * the Web PKI component perform the signature and submit the form (see method
 * sign() on public/javascripts/signature-complete-form.js).
 */
router.post('/complete', (req, res, next) => {
	const { fileId } = req.query;

	// Recover variables from the POST arguments to be used on this step.
	const transferFile = req.body.transferFileField;
	const signature = req.body.signatureField;

	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new SignatureFinisher();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureFinisher);

	// Set PDF to be signed. It's the same file we used on "start" step.
	signatureFinisher.setFileToSignFromPathSync(StorageMock.getDataPath(fileId));

	// Set transfer file.
	signatureFinisher.setTransferFileFromPathSync(transferFile);

	// Set signature.
	signatureFinisher.signature = signature;

	// Generate path for output file and add the signature finisher.
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
	const outputFile = `${uuidv4()}.pdf`;
	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Complete the signature process.
	const getCert = true;
	signatureFinisher
		.complete(getCert)
		.then((result) => {
			// After complete the signature, render the result page, passing the
			// outputFile containing the signed file.
			const certificate = result;
			res.render('pades-signature-express/complete', {
				signedPdf: outputFile,
				signerCert: certificate,
			});
		})
		.catch((err) => next(err));
});

module.exports = router;
