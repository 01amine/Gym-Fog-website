"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMaterial } from "@/hooks/queries/useMaterial";
import { useToast } from "@/hooks/use-toast";

// Academic data structure
const academicData = {
  medecine: {
    "1": [
      "Anatomie",
      "Histologie",
      "Embryologie",
      "Cytologie",
      "Biophysique",
      "Chimie",
      "Biochimie",
      "Biostats",
      "Physiologie",
    ],
    "2": [
      "Appareil cardiovasculaire et pulmonaire - Anatomie",
      "Appareil cardiovasculaire et pulmonaire - Biophysique",
      "Appareil cardiovasculaire et pulmonaire - Histologie",
      "Appareil cardiovasculaire et pulmonaire - Physiologie",
      "Appareil digestif - Anatomie",
      "Appareil digestif - Biochimie",
      "Appareil digestif - Histologie",
      "Appareil digestif - Physiologie",
      "Appareil urinaire - Anatomie",
      "Appareil urinaire - Biochimie",
      "Appareil urinaire - Histologie",
      "Appareil urinaire - Physiologie",
      "Appareil endocrinien et organes de reproduction - Anatomie",
      "Appareil endocrinien et organes de reproduction - Biochimie",
      "Appareil endocrinien et organes de reproduction - Histologie",
      "Appareil endocrinien et organes de reproduction - Physiologie",
      "Système nerveux et organes de sens - Anatomie",
      "Système nerveux et organes de sens - Biophysique",
      "Système nerveux et organes de sens - Histologie",
      "Système nerveux et organes de sens - Physiologie",
      "Génétique",
      "Immunologie",
    ],
    "3": [
      "Appareil cardiovasculaire - Sémiologie",
      "Appareil cardiovasculaire - Physiopathologie",
      "Appareil cardiovasculaire - Radiologie",
      "Appareil cardiovasculaire - Psychologie",
      "Appareil respiratoire - Sémiologie",
      "Appareil respiratoire - Physiopathologie",
      "Appareil respiratoire - Radiologie",
      "Appareil respiratoire - Psychologie",
      "Appareil neurologique - Sémiologie",
      "Appareil neurologique - Physiopathologie",
      "Appareil neurologique - Radiologie",
      "Appareil neurologique - Biochimie",
      "Appareil locomoteur - Sémiologie",
      "Appareil locomoteur - Physiopathologie",
      "Appareil locomoteur - Radiologie",
      "Appareil locomoteur - Biochimie",
      "Organes cutanés - Sémiologie",
      "Organes cutanés - Physiopathologie",
      "Organes cutanés - Radiologie",
      "Organes cutanés - Biochimie",
      "Appareil endocrinien - Sémiologie",
      "Appareil endocrinien - Physiopathologie",
      "Appareil endocrinien - Radiologie",
      "Appareil endocrinien - Biochimie",
      "Appareil reproducteur - Sémiologie",
      "Appareil reproducteur - Physiopathologie",
      "Appareil reproducteur - Radiologie",
      "Appareil reproducteur - Biochimie",
      "Appareil urinaire - Sémiologie",
      "Appareil urinaire - Physiopathologie",
      "Appareil urinaire - Radiologie",
      "Appareil urinaire - Biochimie",
      "Appareil digestif - Sémiologie",
      "Appareil digestif - Physiopathologie",
      "Appareil digestif - Radiologie",
      "Appareil digestif - Biochimie",
      "Organes hématopoïétiques - Sémiologie",
      "Organes hématopoïétiques - Physiopathologie",
      "Organes hématopoïétiques - Radiologie",
      "Organes hématopoïétiques - Biochimie",
      "Anatomie et cytologie pathologiques",
      "Immunologie",
      "Microbiologie médicale",
      "Parasitologie - Mycologie",
      "Pharmacologie clinique",
    ],
    "4": [
      "Gastro",
      "Hemato-Oncologie",
      "Cardiologie",
      "Pneumologie",
      "Maladies Infectieuses",
      "Neurologie",
    ],
    "5": [
      "Traumato",
      "Uro-Nephro",
      "Pediatrie",
      "Psychiatrie",
      "Gyneco-Obstetrique",
      "Endo-Diabeto",
    ],
    "6": [
      "Medecine du Travail",
      "Épidémiologie",
      "Ophtalmologie ",
      "UMC",
      "Medecine Legale",
      "Maladies de Systeme",
      "Geriatrie",
      "Dermato",
      "ORL",
    ],
  },
  pharmacie: {
    "1": [
      "Chimie générale",
      "Chimie organique",
      "Anatomie",
      "Biologie végétale",
      "Embryologie et histologie",
      "Cytologie et physiologie cellulaire",
      "Biomathématique, informatique et biostatistique",
      "Histoire de la pharmacie",
      "Physiologie",
      "Langue française",
      "Physique",
    ],
    "2": [
      "Chimie analytique",
      "Chimie Minérale",
      "Biochimie",
      "Botanique",
      "Biophysique",
      "Génétique",
      "Physiopathologie",
      "Langue anglaise",
    ],
    "3": [
      "Pharmacologie",
      "Chimie thérapeutique",
      "Chimie analytique",
      "Pharmacie galénique",
      "Pharmacognosie",
      "Sémiologie",
    ],
    "4": [
      "Microbiologie",
      "Biochimie",
      "Immunologie",
      "Parasitologie",
      "Hemobiologie",
    ],
    "5": [
      "Toxicologie",
      "Hydrologie bromatologie",
      "Pharmacie clinique",
      "Épidémiologie",
      "Gestion pharmaceutique",
      "Droit pharmaceutique",
      "Pharmacie hospitalière",
      "Pharmacie industrielle",
    ],
  },
  dentaire: {
    "1": [
      "Anatomie",
      "Histologie",
      "Embryologie",
      "Cytologie",
      "Génétique",
      "Déontologie",
      "Biophysique",
      "Physique",
      "Chimie",
      "Biochimie",
      "Biomathématique",
      "Physiologie générale",
    ],
    "2": [
      "Prothèse dentaire",
      "Anatomie dentaire",
      "OCE",
      "Biomatériaux",
      "ODF",
      "Histologie",
      "Physiologie Spécial",
      "Microbiologie",
      "Pathologie",
      "Hygiène",
      "Immunologie",
      "Anatomie humaine",
      "Parodontologie",
    ],
    "3": [
      "ODF",
      "Prothèse",
      "Oxyologie",
      "Radiologie",
      "Parodontologie",
      "Anapath",
      "Anesthésiologie",
      "Occluso",
      "Pathologie",
      "Pharmacologie",
      "OCE",
    ],
    "4": [
      "Prothèse",
      "Implantologie",
      "ODF",
      "Parodontologie",
      "OCE",
      "Dentologie",
      "Odontologie gériatrique",
      "OP",
      "Pathologie Bucco Dentaire",
      "Pathologie Médicale",
    ],
    "5": [
      "Pathologie",
      "ODF",
      "Implantologie",
      "Prothèse",
      "Pathologie",
      "OCE",
      "OPS",
      "OP",
      "Ergonomie",
    ],
  },
  pharmacieIndustrielle: {
    "1": [
      "Chimie générale",
      "Chimie organique",
      "Biologie végétale",
      "Biologie animale",
      "Biostatistique",
      "Logiciels et outils informatiques",
      "Terminologie médico pharmaceutique",
      "Anglais",
      "Chimie inorganique",
      "Anatomie - physiologie - physiopathologie",
      "Taxonomie et systématique végétale",
      "Méthodes chimiques",
      "Méthodes physiques",
      "Histoire des science médicale et pharmaceutique",
    ],
    "2": [
      "Science bioactives naturelle",
      "Pharmacologie générale",
      "Science biologique",
      "Méthodes séparatives",
      "Méthodes spectrales",
      "Opérations pharmaceutiques",
      "Bonnes pratiques",
      "Anglais",
      "Phytothérapie aromatique",
      "Pharmacologie spéciale",
      "Analyses biologiques",
      "Formes pharmaceutiques",
      "Normes et guidelines",
    ],
    "3": [
      "Biotechnologie",
      "Production pharmaceutique",
      "Contrôle de qualité",
      "Économie de la santé",
      "Métrologie qualification et validation",
      "Management qualité",
      "HSE",
      "Législation et code du travail",
      "Gestes sanitaires",
      "Langues étrangères",
      "Insertion professionnelle",
      "Technique de rédaction",
    ],
  },
};

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMaterialModal({
  isOpen,
  onClose,
}: AddMaterialModalProps) {
  const { mutate, isPending } = useCreateMaterial();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    material_type: "",
    price_dzd: 0,
    study_year: [] as string[],
    specialite: [] as string[],
    module: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "price_dzd" ? Number(value) : value,
    }));
  };

  const toggleMultiSelect = (
    field: "study_year" | "specialite",
    value: string
  ) => {
    setFormData((prev) => {
      const values = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];

      return {
        ...prev,
        [field]: values,
        module:
          field === "specialite" || field === "study_year" ? "" : prev.module,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.material_type ||
      !file ||
      images.length === 0
    ) {
      toast({
        title: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    mutate(
      {
        data: {
          ...formData,
          module: formData.module || undefined,
        },
        file,
        images,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({
            title: "",
            description: "",
            material_type: "",
            price_dzd: 0,
            study_year: [],
            specialite: [],
            module: "",
          });
          setFile(null);
          setImages([]);
        },
      }
    );
  };

  const getAvailableModules = () => {
    if (!formData.specialite.length || !formData.study_year.length) return [];

    let modules: string[] = [];
    formData.specialite.forEach((spec) => {
      const specData = academicData[spec as keyof typeof academicData];
      if (specData) {
        formData.study_year.forEach((year) => {
          modules = [
            ...modules,
            ...(specData[year as keyof typeof specData] || []),
          ];
        });
      }
    });
    return [...new Set(modules)];
  };

  const getAvailableYears = () => {
    if (!formData.specialite.length) return [];
    let years: string[] = [];
    formData.specialite.forEach((spec) => {
      const specData = academicData[spec as keyof typeof academicData];
      if (specData) years = [...years, ...Object.keys(specData)];
    });
    return [...new Set(years)];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau support</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau livre ou document pour les étudiants
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="sm:text-right">
                Titre
              </Label>
              <Input
                id="title"
                className="sm:col-span-3"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="sm:text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="sm:col-span-3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Type */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="material_type" className="sm:text-right">
                Type
              </Label>
              <Select
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, material_type: val }))
                }
                value={formData.material_type}
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="livre">Livre</SelectItem>
                  <SelectItem value="polycopie">Polycopie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="price_dzd" className="sm:text-right">
                Prix (DZD)
              </Label>
              <Input
                id="price_dzd"
                type="number"
                className="sm:col-span-3"
                value={formData.price_dzd}
                onChange={handleChange}
              />
            </div>

            {/* Specialite multi-select */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label className="sm:text-right">Spécialité(s)</Label>
              <div className="sm:col-span-3 space-y-1">
                {["medecine", "pharmacie", "dentaire", "pharmacieIndustrielle"].map(
                  (spec) => (
                    <div key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.specialite.includes(spec)}
                        onChange={() => toggleMultiSelect("specialite", spec)}
                        className="mr-2"
                      />
                      {spec}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Study years multi-select */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label className="sm:text-right">Année(s)</Label>
              <div className="sm:col-span-3 space-y-1">
                {getAvailableYears().map((year) => (
                  <div key={year} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.study_year.includes(year)}
                      onChange={() => toggleMultiSelect("study_year", year)}
                      className="mr-2"
                    />
                    {year}ème année
                  </div>
                ))}
              </div>
            </div>

            {/* Module */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="module" className="sm:text-right">
                Module
              </Label>
              <Input
                id="module"
                className="sm:col-span-3"
                value={formData.module}
                onChange={handleChange}
                list="modules-list"
                disabled={!formData.specialite.length || !formData.study_year.length}
              />
              <datalist id="modules-list">
                {getAvailableModules().map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>

            {/* File */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="sm:text-right">
                Fichier
              </Label>
              <Input
                id="file"
                type="file"
                className="sm:col-span-3"
                onChange={handleFileChange}
              />
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="sm:text-right">
                Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                className="sm:col-span-3"
                onChange={handleImagesChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
