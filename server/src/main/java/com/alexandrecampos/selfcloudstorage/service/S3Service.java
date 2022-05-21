package com.alexandrecampos.selfcloudstorage.service;

import com.amazonaws.services.s3.model.Bucket;

import java.util.List;

public interface S3Service {
    List<Bucket> listBuckets();
}
