package com.alexandrecampos.selfcloudstorage.controller;

import com.amazonaws.services.s3.model.Bucket;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("s3")
public interface S3Controller {
    @GetMapping
    List<Bucket> listBuckets();
}
