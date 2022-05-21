package com.alexandrecampos.selfcloudstorage.controller.impl;

import com.alexandrecampos.selfcloudstorage.controller.S3Controller;
import com.alexandrecampos.selfcloudstorage.service.S3Service;
import com.amazonaws.services.s3.model.Bucket;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class S3ControllerImpl implements S3Controller {
    private final S3Service s3Service;

    @Override
    public List<Bucket> listBuckets() {
        return s3Service.listBuckets();
    }
}
