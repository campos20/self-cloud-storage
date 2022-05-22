package com.alexandrecampos.selfcloudstorage.controller;

import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("s3")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public interface S3Controller {
    @GetMapping
    List<Bucket> listBuckets();

    @GetMapping("{bucketName}")
    List<S3ObjectSummary> listObjects(@PathVariable String bucketName);
}
