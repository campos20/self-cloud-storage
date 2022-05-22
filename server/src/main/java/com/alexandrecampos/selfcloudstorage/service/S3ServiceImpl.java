package com.alexandrecampos.selfcloudstorage.service;

import com.alexandrecampos.selfcloudstorage.util.LoadResourceUtil;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class S3ServiceImpl implements S3Service {
    private final AmazonS3 amazonS3;
    private final ObjectMapper objectMapper;

    private static final TypeReference BUCKET_TYPE_REFERENCE = new TypeReference<List<Bucket>>() {
    };

    @Override
    public List<Bucket> listBuckets() {
        String mock = LoadResourceUtil.getResource("mock/bucketList.json");
        try {
            return (List<Bucket>) objectMapper.readValue(mock, BUCKET_TYPE_REFERENCE);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
