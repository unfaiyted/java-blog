package com.codeup.blog.controllers;

import com.codeup.blog.models.Document;
import com.codeup.blog.models.Post;
import com.codeup.blog.services.DocumentUploadService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
            @RequestParam(name = "file") MultipartFile uploadedFile) throws IOException {

        if (!uploadedFile.getOriginalFilename().isEmpty()) {
            Document upload = docDao.upload(uploadedFile);
            ObjectMapper objectMapper = new ObjectMapper();
            String entities = objectMapper.writeValueAsString(upload);

         return new ResponseEntity<>(entities,HttpStatus.OK);

        } else {
           return new ResponseEntity<>("Invalid file", HttpStatus.BAD_REQUEST);

        }

    }

    @PostMapping("/upload")
    public @ResponseBody Document uploadDoc(
            @RequestParam(name = "file") MultipartFile uploadedFile) throws IOException {

        if (!uploadedFile.getOriginalFilename().isEmpty()) {
            Document upload = docDao.upload(uploadedFile);
            return new Document(upload);
        } else {
            return null;
        }

    }

}