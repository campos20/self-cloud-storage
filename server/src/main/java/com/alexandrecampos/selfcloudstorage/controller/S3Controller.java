package com.alexandrecampos.selfcloudstorage.controller;

import com.amazonaws.services.s3.model.Bucket;

import java.util.List;

public interface S3Controller {
    List<Bucket> listBuckets();
}
