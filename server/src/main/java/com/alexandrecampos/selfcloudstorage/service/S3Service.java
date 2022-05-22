package com.alexandrecampos.selfcloudstorage.service;

import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import java.util.List;

public interface S3Service {
    List<Bucket> listBuckets();

    List<S3ObjectSummary> listObjects(String bucketName);
}
