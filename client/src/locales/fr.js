/* eslint-disable max-len */
const fr = {
  'lang.en.long': 'English',
  'lang.fr.long': 'Français',
  'lang.en.short': 'EN',
  'lang.fr.short': 'FR',
  'header.title': 'Centre québécois de génomique clinique',
  'message.error.generic': 'Action échouée... ',
  'message.success.generic': 'Action été effectuée avec succès!',
  'navigation.main.searchPatient': 'Recherche de patient',
  'navigation.user.logout': 'Déconnexion',
  'response.error.Ok': 'Ok',
  'response.error.Created': 'Ok',
  'response.error.NoContent': 'Aucun contenu',
  'response.error.BadRequest': 'Requête invalide',
  'response.error.Unauthorized': 'Non-autorisé',
  'response.error.Forbidden': 'Accès interdit',
  'response.error.NotFound': 'Introuvable',
  'response.error.InternalError': 'Erreur interne',
  'response.error.NotImplemented': 'Fonctionnalité non implémentée',
  'response.message.OK': 'OK',
  'response.message.NOT_FOUND': 'Ressource introuvable',
  'response.message.CREATED': 'Ressource crée',
  'response.message.UPDATED': 'Ressource mise à jour',
  'response.message.DELETED': 'Ressource supprimée',
  'form.error.isRequired': 'Ce champ est requis',
  'form.error.isNotEmail': 'Ce champ doit être un courriel',
  'form.login.usernameField': 'Adresse électronique',
  'form.login.passwordField': 'Mot de passe',
  'form.login.submitButton': 'Connexion',
  'form.login.forgotPassword': 'Mot de passe oublié ?',
  'form.login.howToRegister': 'Pour obtenir un compte, nous écrire à xx@ksks.org',
  'screen.nomatch.404': '404 - Introuvable',
  'screen.patient.backToSearch': 'Retour à la recherche de patients',
  'screen.patient.details.identifier': 'Identifiant',
  'screen.patient.details.mrn': 'MRN',
  'screen.patient.details.ramq': 'RAMQ',
  'screen.patient.details.organization': 'Organization',
  'screen.patient.details.dob': 'Date de naissance',
  'screen.patient.details.firstName': 'Prénom',
  'screen.patient.details.lastName': 'Nom',
  'screen.patient.details.gender': 'Sexe',
  'screen.patient.details.family': 'Famille',
  'screen.patient.details.ethnicity': 'Ethnicité',
  'screen.patient.details.study': 'Étude',
  'screen.patient.details.proband': 'Proband',
  'screen.patient.details.position': 'Position',
  'screen.patient.details.referringPractitioner': 'Médecin référent',
  'screen.patient.details.mln': 'MLN',
  'screen.patient.details.id': 'ID',
  'screen.patient.details.practitioner': 'Médecin',
  'screen.patient.details.date': 'Date',
  'screen.patient.details.ageAtConsultation': 'Âge du patient à la consultation',
  'screen.patient.details.type': 'Type',
  'screen.patient.details.author': 'Requérant',
  'screen.patient.details.specimen': 'Spécimen',
  'screen.patient.details.consultation': 'Consultation',
  'screen.patient.details.status': 'Statut',
  'screen.patient.details.request': 'Requête',
  'screen.patient.details.barcode': 'Code barre',
  'screen.patient.details.code': 'Code',
  'screen.patient.details.term': 'Terme',
  'screen.patient.details.notes': 'Notes',
  'screen.patient.details.mother': 'Mère',
  'screen.patient.details.father': 'Père',
  'screen.patient.details.familyId': 'ID Famille',
  'screen.patient.details.configuration': 'Configuration',
  'screen.patient.details.dateAndTime': 'Date et heure',
  'screen.patient.details.ontology': 'Ontologie',
  'screen.patient.details.observed': 'Interprétation',
  'screen.patient.details.apparition': 'Apparition',
  'screen.patient.header.identification': 'Identification',
  'screen.patient.header.additionalInformation': 'Informations additionnelles',
  'screen.patient.header.referringPractitioner': 'Médecin référent',
  'screen.patient.header.geneticalConsultations': 'Consultations génétiques',
  'screen.patient.header.requests': 'Requêtes',
  'screen.patient.header.samples': 'Échantillons',
  'screen.patient.header.clinicalSigns': 'Signes cliniques',
  'screen.patient.header.indications': 'Indications',
  'screen.patient.header.generalObservations': 'Observations générales',
  'screen.patient.header.family': 'Famille',
  'screen.patient.header.familyHistory': 'Histoire familiale',
  'screen.patient.header.generalInformation': 'Informations générales',
  'screen.patient.header.familyMembers': 'Membres de la famille',
  'screen.patient.tab.patient': 'Informations du patient',
  'screen.patient.tab.clinical': 'Informations cliniques',
  'screen.patientsearch.placeholder': 'Critères de recherche acceptés: MRN, ID Patient, RAMQ, Nom, Prénom, ID Famille, ID Specimen et Étude',
  'screen.patientsearch.table.patientId': 'Identifiant',
  'screen.patientsearch.table.mrn': 'MRN',
  'screen.patientsearch.table.organization': 'Institution',
  'screen.patientsearch.table.firstName': 'Prénom',
  'screen.patientsearch.table.lastName': 'Nom',
  'screen.patientsearch.table.dob': 'Date de naissance',
  'screen.patientsearch.table.familyId': 'ID Famille',
  'screen.patientsearch.table.position': 'Position',
  'screen.patientsearch.table.practitioner': 'Médecin référent',
  'screen.patientsearch.table.request': 'Requête',
  'screen.patientsearch.table.status': 'Statut',
  'screen.patientsearch.download': 'Téléchargez la page en TSV',
  'screen.patientsearch.pagination': '%d-%d sur %d résulats',
  'screen.patientvariant.category_variant': 'Variants',
  'screen.patientvariant.filter_variant_type': 'Type de variant',
  'screen.patientvariant.filter_variant_type.description': 'Ceci est une description',
  'screen.patientvariant.filter_consequence': 'Conséquence',
  'screen.patientvariant.filter_consequence.description': 'Ceci est une description',
  'screen.patientvariant.filter_extref_dbsnp': 'dbSNP',
  'screen.patientvariant.filter_extref_dbsnp.description': 'Ceci est une description',
  'screen.patientvariant.filter_extref_pubmed': 'pubMed',
  'screen.patientvariant.filter_extref_pubmed.description': 'Ceci est une description',
  'screen.patientvariant.filter_extref_orphanet': 'Orphanet',
  'screen.patientvariant.filter_extref_orphanet.description': 'Ceci est une description',
  'screen.patientvariant.filter_extref_omim': 'OMIN',
  'screen.patientvariant.filter_extref_omim.description': 'Ceci est une description',
  'screen.patientvariant.filter_extref_clinvar': 'ClinVar',
  'screen.patientvariant.filter_extref_clinvar.description': 'Ceci est une description',
  'screen.patientvariant.filter_impact': 'Impact clinique',
  'screen.patientvariant.filter_impact.description': 'Ceci est une description',
  'screen.patientvariant.filter_chromosome': 'Chromosome',
  'screen.patientvariant.filter_chromosome.description': 'Ceci est une description',
  'screen.patientvariant.category_genomic': 'Génomique',
  'screen.patientvariant.filter_gene_type': 'Type de gène',
  'screen.patientvariant.filter_gene_type.description': 'Ceci est une description',
  'screen.patientvariant.filter_genegroup_radboud': 'Radboudumc',
  'screen.patientvariant.filter_genegroup_radboud.description': 'Ceci est une description',
  'screen.patientvariant.filter_genegroup_orphanet': 'Orphanet',
  'screen.patientvariant.filter_genegroup_orphanet.description': 'Ceci est une description',
  'screen.patientvariant.filter_genegroup_ensemble': 'Ensemble',
  'screen.patientvariant.filter_genegroup_ensemble.description': 'Ceci est une description',
  'screen.patientvariant.category_prediction': 'Prédictions in-silico',
  'screen.patientvariant.filter_prediction_fathmm': 'FATHMM',
  'screen.patientvariant.filter_prediction_fathmm.description': 'Ceci est une description',
  'screen.patientvariant.filter_prediction_sift': 'SIFT',
  'screen.patientvariant.filter_prediction_sift.description': 'Ceci est une description',
  'screen.patientvariant.filter_prediction_lrt': 'LRT',
  'screen.patientvariant.filter_prediction_lrt.description': 'Ceci est une description',
  'screen.patientvariant.filter_prediction_mutation_assessor': 'Mutation Assessor',
  'screen.patientvariant.filter_prediction_mutation_assessor.description': 'Ceci est une description',
  'screen.patientvariant.filter_mutation_assessor': 'Mutation Assessor',
  'screen.patientvariant.filter_mutation_assessor.description': 'Ceci est une description',
  'screen.patientvariant.filter_prediction_polyphen2_hdiv': 'Polyphen2 HDIV',
  'screen.patientvariant.filter_prediction_polyphen2_hdiv.description': 'Ceci est une description',
  'screen.patientvariant.filter_prediction_polyphen2_hvar': 'Polyphen2 HVAR',
  'screen.patientvariant.filter_prediction_polyphen2_hvar.description': 'Ceci est une description',
  'screen.patientvariant.filter_prediction_gerp': 'Gerp',
  'screen.patientvariant.filter_prediction_gerp.description': 'Ceci est une description',
  'screen.patientvariant.category_cohort': 'Cohortes',
  'screen.patientvariant.category_zygosity': 'Zygosité et Famille',
  'screen.patientvariant.filter_transmission': 'Transmission',
  'screen.patientvariant.filter_transmission.description': 'Ceci est une description',
  'screen.patientvariant.category_metric': 'Métriques',
  'screen.patientvariant.filter_value': 'Valeur',
  'screen.patientvariant.statement.combine': 'Combiner',
  'screen.patientvariant.statement.delete': 'Supprimer',
  'screen.patientvariant.statement.newQuery': 'Nouvelle requête',
  'screen.patientvariant.statement.tooltip.check': 'Cocher',
  'screen.patientvariant.statement.tooltip.uncheck': 'Décocher',
  'screen.patientvariant.statement.tooltip.all': 'Tout',
  'screen.patientvariant.statement.tooltip.combineSelection': 'Combiner la sélection',
  'screen.patientvariant.statement.tooltip.deleteSelection': 'Supprimer la sélection',
  'screen.patientvariant.statement.tooltip.undo': 'Annuler',
  'screen.patientvariant.statement.and': 'Et',
  'screen.patientvariant.statement.or': 'Ou',
  'screen.patientvariant.statement.andnot': 'Exclure',
  'screen.patientvariant.statement.modal.title': 'Êtes-vous sûr de vouloir supprimer cette requête?',
  'screen.patientvariant.statement.modal.content': 'Cette requête est utilisée dans une sous-requête',
  'screen.patientvariant.statement.modal.ok': 'Oui',
  'screen.patientvariant.statement.modal.cancel': 'Non',
  'screen.patientvariant.query.menu.add': 'Ajouter le titre',
  'screen.patientvariant.query.menu.remove': 'Supprimer le titre',
  'screen.patientvariant.query.menu.copy': 'Copier la requête',
  'screen.patientvariant.query.menu.maximize': 'Maximiser la vue',
  'screen.patientvariant.query.menu.minimize': 'Minimiser la vue',
  'screen.patientvariant.query.menu.duplicate': 'Dupliquer',
  'screen.patientvariant.query.menu.revert': 'Rétablir les changements',
  'screen.patientvariant.query.menu.advancedEditor': 'Éditeur avancé',
  'screen.patientvariant.query.menu.delete': 'Supprimer',
  'screen.patientvariant.filter.search': 'Recherche',
  'screen.patientvariant.filter.operand.all': 'Toutes',
  'screen.patientvariant.filter.operand.one': 'Au moins une',
  'screen.patientvariant.filter.operand.none': 'Aucune',
  'screen.patientvariant.filter.operand.gt': '>',
  'screen.patientvariant.filter.operand.gte': '>=',
  'screen.patientvariant.filter.operand.lt': '<',
  'screen.patientvariant.filter.operand.lte': '<=',
  'screen.patientvariant.filter.selection.all': 'Tous',
  'screen.patientvariant.filter.selection.none': 'Aucun',
  'screen.patientvariant.results.table.variant': 'Variant',
  'screen.patientvariant.results.table.type': 'Type',
  'screen.patientvariant.results.table.dbsnp': 'dbSnp',
  'screen.patientvariant.results.table.consequence': 'Conséquence(s)',
  'screen.patientvariant.results.table.clinvar': 'ClinVar',
  'screen.patientvariant.results.table.vep': 'VEP',
  'screen.patientvariant.results.table.sift': 'SIFT',
  'screen.patientvariant.results.table.polyph': 'Polyphe',
  'screen.patientvariant.results.table.zygosity': 'Zygosité',
  'screen.patientvariant.results.table.pubmed': 'pubMed',
  'screen.patientvariant.results.table.gene': 'Gène',
  'screen.patientvariant.results.table.localisation': 'Localization',
  'screen.patientvariant.results.table.variants': 'Variants',
  'screen.patientvariant.results.table.omin': 'Omin',
  'screen.patientvariant.results.table.orphanet': 'Orphanet',
  'screen.patientvariant.results.table.ensemble': 'Ensemble',
};

export default fr;
