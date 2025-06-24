export const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	const day = String(date.getDate()).padStart(2, '0');
	 const month = date.toLocaleString('default', { month: 'long' });
	 const year = date.getFullYear(); 
	  return `${day}/${month}/${year}`;
}
