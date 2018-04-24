package com.codeup.blog.services;

import com.codeup.blog.models.Document;
import com.codeup.blog.repositories.Documents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;


@Service
public class DocumentUploadService {

    private final Documents documents;

    @Value("${file-upload-path}")
    private String storeDirectory;

    @Autowired
    public DocumentUploadService(Documents documents) {
        this.documents = documents;
    }

    public Document upload(MultipartFile uploadedFile) {
       String filename = uploadedFile.getOriginalFilename();
       String filepath = Paths.get(storeDirectory, filename).toString();

       File destinationFile = new File(filepath);

           // File successfully uploaded.
           try {
               uploadedFile.transferTo(destinationFile);
               return new Document(filename,getFileExtension(destinationFile), storeDirectory ,uploadedFile.getSize());
           } catch( IOException e) { //Upload Failed
               e.printStackTrace();
               return null;
           }
    }

    //     public List<Document> upload(List<Document> documents) {
    //              for(Documents document: documents){
    //                  upload(MultipartFile uploadFile);
    //             }

        private static String getFileExtension(File file) {
            String fileName = file.getName();
            if(fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0)
                return fileName.substring(fileName.lastIndexOf(".")+1);
            else return "";
        }

}



