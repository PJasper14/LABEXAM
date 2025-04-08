import React, { useState, useRef } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (imageDataUrl: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  initialImage, 
  onImageChange,
  label = 'Product Image' 
}) => {
  const [previewImage, setPreviewImage] = useState<string>(initialImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setPreviewImage(imageDataUrl);
        onImageChange(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex align-items-center mb-2">
        <Button 
          variant="outline-secondary" 
          onClick={() => fileInputRef.current?.click()}
          className="me-2"
        >
          <FontAwesomeIcon icon={faUpload} className="me-2" />
          Select Image
        </Button>
        {previewImage && (
          <Button 
            variant="outline-danger"
            onClick={handleRemoveImage}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Remove
          </Button>
        )}
      </div>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="d-none"
      />
      {previewImage && (
        <div className="mt-3 border p-2 rounded">
          <Image 
            src={previewImage} 
            alt="Preview" 
            fluid 
            style={{ maxHeight: '200px', objectFit: 'contain' }} 
          />
        </div>
      )}
    </Form.Group>
  );
};

export default ImageUploader; 