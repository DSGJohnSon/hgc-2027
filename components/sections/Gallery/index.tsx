import { ImageGallery } from "@/components/ui/image-gallery";
import { cn } from "@/lib/utils";
import { GalleryProps } from "@/types/components/sections/Gallery";

export default function Gallery({ data, isDetailedEventPage }: GalleryProps) {
  return (
    <div className={cn("relative w-full overflow-x-hidden bg-transparent",
      isDetailedEventPage ? "py-4" : ""
    )}>
      <div className={cn("container mx-auto",
        isDetailedEventPage ? "py-32" : "py-0 md:py-32 px-16"
      )}>
        <div className={cn("text-center space-y-4",
          isDetailedEventPage ? "mb-16" : "mb-16"
        )}>
          <p className="text-theme2 font-rajdhani uppercase tracking-wider text-base font-semibold">
            {data.subtitle}
          </p>
          <h2 className="font-goldman text-4xl md:text-5xl text-white uppercase">
            {data.title}
          </h2>
        </div>
        <ImageGallery images={data.images} />
      </div>
    </div>
  );
}
