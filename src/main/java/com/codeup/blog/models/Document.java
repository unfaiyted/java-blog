package com.codeup.blog.models;

import com.fasterxml.jackson.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name="documents")
public class Document {
        @Id @GeneratedValue
        private Long id;

        @Column(nullable = false)
        @Size(min = 1, message = "Filename cannot be empty. ")
        private String fileName;

        @Column(nullable = false)
        private String extension;

        @Column
        @Value("${file-upload-path}")
        private String directory;

        @Column
        private Long fileSize;

        @Column(nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();

        @ManyToOne
        @JsonManagedReference
        private Post post;

        public Document() {
        }

        public Document(String fullpath, Long fileSize) {
            // TODO: break full path into parts
        }

        public Document(Document copy) {
            this.fileName = copy.fileName;
            this.extension = copy.extension;
            this.fileSize = copy.fileSize;
            this.createdAt = copy.createdAt;
        }

        public Document(String fileName, String extension, Long fileSize) {
            this.fileName = fileName;
            this.extension = extension;
            this.fileSize = fileSize;
            this.createdAt = LocalDateTime.now();

        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getExtension() {
            return extension;
        }

        public String getFullPath() {
            return  directory + "/" + fileName;
        }

        public void setExtension(String extension) {
            this.extension = extension;
        }

        public Long getFileSize() {
            return fileSize;
        }

        public void setFileSize(Long fileSize) {
            this.fileSize = fileSize;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public String getDirectory() {
            return directory;
        }

        public void setDirectory(String directory) {
            this.directory = directory;
        }

        public Post getPost() {
            return post;
        }

        public void setPost(Post post) {
            this.post = post;
        }
}
