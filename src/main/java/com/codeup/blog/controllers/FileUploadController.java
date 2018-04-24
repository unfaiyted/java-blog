package com.codeup.blog.controllers;

import com.codeup.blog.models.Document;
import com.codeup.blog.services.DocumentUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
public class FileUploadController {
    private final DocumentUploadService docDao;

    @Autowired
    public FileUploadController(DocumentUploadService docDao) {
        this.docDao = docDao;
    }

    @GetMapping("/fileupload")
     public String showUploadFileForm() {
            return "/fileupload";
    }

    @PostMapping("/fileupload")
    public ResponseEntity<Object> saveFile (
            @RequestParam(name = "file") MultipartFile uploadedFile, Model model) throws IOException {

        if (!uploadedFile.getOriginalFilename().isEmpty()) {
            Document upload = docDao.upload(uploadedFile);
        } else {
            return new ResponseEntity<>("Invalid file", HttpStatus.BAD_REQUEST);
        }
            return new ResponseEntity<>("File Successfully Uploaded",HttpStatus.OK);
    }

    @GetMapping("/multiupload")
    public String showMultiUpload() {

        return "/multiUpload";
    }

}
