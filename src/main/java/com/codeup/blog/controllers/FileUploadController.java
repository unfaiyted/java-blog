package com.codeup.blog.controllers;

import com.codeup.blog.models.Document;
import com.codeup.blog.services.DocumentUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

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
    public String saveFile( @RequestParam(name = "file") MultipartFile uploadedFile, Model model) {
        Document upload = docDao.upload(uploadedFile);
        model.addAttribute("message",upload.getFileName() + " uploaded successfully.");
        return "/fileupload";
    }


    @GetMapping("/multiupload")
    public String showMultiUpload() {

        return "/multiUpload";
    }

}
