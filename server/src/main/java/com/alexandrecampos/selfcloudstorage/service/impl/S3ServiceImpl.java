package com.alexandrecampos.selfcloudstorage.service.impl;

import com.alexandrecampos.selfcloudstorage.service.S3Service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class S3ServiceImpl implements S3Service {
    private final AmazonS3 amazonS3;
//    private final ObjectMapper objectMapper;
//    private static final TypeReference BUCKET_TYPE_REFERENCE = new TypeReference<List<Bucket>>() {
//    };

    @Override
    public List<Bucket> listBuckets() {
        return amazonS3.listBuckets();
//        String mock = LoadResourceUtil.getResource("mock/bucketList.json");
//        try {
//            return (List<Bucket>) objectMapper.readValue(mock, BUCKET_TYPE_REFERENCE);
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }
    }

    @Override
    public List<S3ObjectSummary> listObjects(String bucketName) {
        ListObjectsV2Result objects = amazonS3.listObjectsV2(bucketName);
        return objects.getObjectSummaries();
    }
}
