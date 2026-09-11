//SECTION GALLERY

export interface GalleryProps {
  data: GalleryData;
  isDetailedEventPage?: boolean;
}

export interface GalleryData {
  title: string;
  subtitle: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
}
