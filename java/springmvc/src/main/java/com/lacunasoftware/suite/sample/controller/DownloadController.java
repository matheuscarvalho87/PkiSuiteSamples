package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.suite.sample.util.SampleDocs;
import com.lacunasoftware.suite.sample.util.StorageMock;
import com.lacunasoftware.suite.sample.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

@Controller
@RequestMapping("/download")
public class DownloadController {

	/**
	 * GET /download/{fileId}
	 *
	 * This function will return a file from the temporary folder to user.
	 */
	@GetMapping("/{fileId:.+}")
	public void get(
		HttpServletResponse httpResponse,
		@PathVariable String fileId
	) throws IOException {

		if (Util.isNullOrEmpty(fileId)) {
			httpResponse.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		if (!StorageMock.exists(fileId)) {
			httpResponse.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		String filename = StorageMock.retriveFilename(fileId);
		httpResponse.setHeader("Content-Disposition", String.format("attachment; filename=%s", filename));
		try (OutputStream outStream = httpResponse.getOutputStream()) {
			Files.copy(StorageMock.getDataPath(fileId), outStream);
		}
	}

	/**
	 * GET /download/sample/{sampleId}
	 *
	 * This function will return one of the available sample files to user.
	 */
	@GetMapping("/sample/{sampleId:.+}")
	public void sample(
		HttpServletResponse httpResponse,
		@PathVariable SampleDocs sampleId
	) throws IOException {

		httpResponse.setHeader("Content-Disposition", String.format("attachment; filename=%s", StorageMock.getSampleDocName(sampleId)));
		try (OutputStream outStream = httpResponse.getOutputStream()) {
			Files.copy(StorageMock.getSampleDocPath(sampleId), outStream);
		}
	}

	/**
	 * GET /download/doc/{id}
	 *
	 * This function will return one of the available documents used in one of the batch signature
	 * samples.
	 */
	@GetMapping("/doc/{id:.+}")
	public void doc(
		HttpServletResponse httpResponse,
		@PathVariable int id
	) throws IOException {
		httpResponse.setHeader("Content-Disposition", String.format("attachment; filename=%02d.pdf", id));
		try (OutputStream outStream = httpResponse.getOutputStream()) {
			Files.copy(StorageMock.getBatchDocPath(id), outStream);
		}
	}
}
