import React, { useState } from 'react';
import { Modal, Button, Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface ImageGalleryModalProps {
  show: boolean;
  onHide: () => void;
  images: string[];
  title?: string;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  show,
  onHide,
  images,
  title = 'Image Gallery'
}) => {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const toggleFullScreen = () => {
    setFullscreen(!fullscreen);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'Escape') {
      if (fullscreen) {
        setFullscreen(false);
      } else {
        onHide();
      }
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size={fullscreen ? "xl" : "lg"} 
      centered
      onKeyDown={handleKeyDown}
      className="gallery-modal"
      fullscreen={fullscreen ? true : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
        <Button 
          variant="link" 
          onClick={toggleFullScreen}
          className="ms-auto me-2"
        >
          <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
        </Button>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Carousel 
          activeIndex={index} 
          onSelect={handleSelect}
          interval={null}
          indicators={images.length > 1}
          controls={images.length > 1}
          className="image-gallery-carousel"
          prevIcon={<FontAwesomeIcon icon={faChevronLeft} size="2x" />}
          nextIcon={<FontAwesomeIcon icon={faChevronRight} size="2x" />}
        >
          {images.map((image, i) => (
            <Carousel.Item key={i}>
              <div className="d-flex justify-content-center align-items-center" style={{ 
                height: fullscreen ? 'calc(100vh - 140px)' : '500px',
                background: '#f8f9fa'
              }}>
                <Image
                  src={image}
                  alt={`Image ${i + 1}`}
                  style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    objectFit: 'contain'
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>Image {index + 1} of {images.length}</div>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageGalleryModal; 