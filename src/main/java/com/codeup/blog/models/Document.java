package com.codeup.blog.models;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;


@Entity
@Table(name="files")
public class Document {
        @Id @GeneratedValue
        private Long id;

        @Column(nullable = false)
        @Size(min = 1, message = "Filename cannot be empty. ")
        private String fileName;

        @Column(nullable = false)
        private String extension;

        @Column
        private Long fileSize;

        @Column(nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();

        public Document() {
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
