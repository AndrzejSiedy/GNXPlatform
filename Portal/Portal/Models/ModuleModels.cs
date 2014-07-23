using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Portal.Models
{
    public class ModuleModels
    {
        [Key]
        [Display(AutoGenerateField = true, Name = "Id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; }
        [Display(Name = "Description")]
        public string Desciption { get; set; }
        [Display(Name = "IsPublic")]
        public bool IsPublic { get; set; }
        [Display(Name = "OwnerId", AutoGenerateField=false)]
        public string OwnerId { get; set; }
        [Display(Name = "GadgetUrl")]
        public string GadgetUrl { get; set; }
        [Display(Name = "Thumbnail")]
        public string Thumbnail { get; set; }

    }
}