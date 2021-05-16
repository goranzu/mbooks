function formatDate(date) {
  return date ? new Date(date).toLocaleDateString("nl") : null;
}

export { formatDate };
