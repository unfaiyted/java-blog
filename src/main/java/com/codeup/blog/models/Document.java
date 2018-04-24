package com.codeup.blog.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

        @Column(nullable = false)
        private String directory;

        @Column
        private Long fileSize;

        @Column(nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();

        @ManyToOne
        @JsonBackReference
        private Post post;

        public Document() {
        }


        public Document(String fullpath, Long fileSize) {
            // TODO: break full path into parts
        }

        public Document(String fileName, String extension, String directory, Long fileSize) {
            this.fileName = fileName;
            this.extension = extension;
            this.extension = directory;
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

}
