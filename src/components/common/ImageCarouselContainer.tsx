import useEmblaCarousel from 'embla-carousel-react';
import type { Publicacion } from '../../types/PedidosInterface';
import {  useProductImages } from '../../hooks/useProductImages';
import { useColorScheme } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import { NextButton, PrevButton, usePrevNextButtons } from '../emblaCarousel/EmblaCarouselArrowButtons';

interface CarouselImageProps {
    publicacion: Publicacion;
    width?: number;
    height?: number;
    preview?: boolean;
}

export default function ImageCarouselContainer({publicacion,
    width = 200,
    height = 200}: CarouselImageProps) {

const [emblaRef, emblaApi] = useEmblaCarousel()
const {mode} = useColorScheme();
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)
    const { imageUrls, isLoading } = useProductImages(publicacion);

    if (isLoading || !imageUrls) {
        return (
            <div
                style={{
                    width: width,
                    height: height,
                    backgroundColor: (mode === 'dark' ? 'rgba(32, 32, 32, 0.5)' : 'rgba(247, 247, 247, 0.94)'),
                    border: '1px solid',
                    borderColor: (mode === 'dark' ? '#444444ff' : '#d9d9d9ff'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                }}
            >
                <ImageIcon style={{ fontSize: '24px' }} />
            </div>
        );
    }
    return (
        <>
        
        <div
            ref={emblaRef}
            style={{
                overflow: 'hidden',
                width: width,
                height: height,
                borderRadius: '6px',
                }}>
        
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    userSelect: 'none',
                    marginLeft: '0px',
                    marginRight: '0px',
                }}
            >
                {imageUrls.map((imageUrl, index) => (
                    <div
                        key={index}
                        style={{
                            minWidth: width,
                            height: height,
                            borderRadius: '6px',
                            backgroundColor: (mode === 'dark' ? 'rgba(32, 32, 32, 0.5)' : 'rgba(247, 247, 247, 0.94)'),
                            border: '1px solid',
                            borderColor: (mode === 'dark' ? '#444444ff' : '#d9d9d9ff'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {!imageUrl && <ImageIcon style={{ fontSize: `${Math.min(width, height) / 2}px` }} />}
                    </div>
                ))}
                
            </div>
            
        </div>
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
</>
    );

}