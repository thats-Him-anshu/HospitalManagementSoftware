"use client";

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '1px solid #eee',
    paddingBottom: 20,
  },
  logo: {
    width: 150,
  },
  companyDetails: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 4,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  billTo: {
    width: '50%',
  },
  metaData: {
    width: '40%',
  },
  label: {
    color: '#6b7280',
    marginBottom: 4,
    fontSize: 9,
  },
  value: {
    fontSize: 11,
    marginBottom: 4,
  },
  boldValue: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  summaryBox: {
    width: '40%',
    marginLeft: 'auto',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid #e5e7eb',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
    borderTop: '1px solid #eee',
    paddingTop: 20,
  }
});

const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toFixed(2)}`;
};

interface InvoicePDFProps {
  invoice: any;
  patient: any;
}

export default function InvoicePDF({ invoice, patient }: InvoicePDFProps) {
  const dateStr = new Date(invoice.createdAt || Date.now()).toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* Logo - Note: React-PDF requires absolute URLs or base64 for images in the browser. 
              Using text fallback if image is problematic, but NIDARSANAM logo is requested.
              In production, use absolute URL like https://yourdomain.com/assets/logo.png */}
          <View>
            <Text style={styles.companyName}>NIDARSANAM HEALTH CARE</Text>
            <Text style={{ fontSize: 9, color: '#666', marginTop: 2 }}>Natural Healing. Real Results.</Text>
          </View>
          <View style={styles.companyDetails}>
            <Text>3/850D, Renuga Devi Kovil Street</Text>
            <Text>Manthoppu, Dharmapuri – 636701</Text>
            <Text>Phone: 9952338765</Text>
            <Text>Email: nidarsanamhealthcare@gmail.com</Text>
          </View>
        </View>

        <Text style={styles.invoiceTitle}>INVOICE</Text>

        <View style={styles.detailsRow}>
          <View style={styles.billTo}>
            <Text style={styles.label}>BILL TO:</Text>
            <Text style={styles.boldValue}>{patient.firstName} {patient.lastName}</Text>
            {patient.address && <Text style={styles.value}>{patient.address}</Text>}
            {(patient.city || patient.state) && (
              <Text style={styles.value}>{patient.city}{patient.city && patient.state ? ', ' : ''}{patient.state}</Text>
            )}
            <Text style={styles.value}>Phone: {patient.phone}</Text>
            <Text style={styles.value}>Patient ID: {patient.patientId}</Text>
          </View>

          <View style={styles.metaData}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.label}>Invoice No:</Text>
              <Text style={styles.boldValue}>{invoice.invoiceNumber || 'DRAFT'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{dateStr}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={{ ...styles.value, textTransform: 'uppercase' }}>{invoice.paymentMethod}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.label}>Status:</Text>
              <Text style={{ ...styles.boldValue, textTransform: 'uppercase' }}>{invoice.paymentStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col3}>Unit Price</Text>
            <Text style={styles.col4}>Total</Text>
          </View>

          {invoice.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.col4}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          {invoice.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Discount:</Text>
              <Text>-{formatCurrency(invoice.discount)}</Text>
            </View>
          )}
          {invoice.tax > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Tax:</Text>
              <Text>{formatCurrency(invoice.tax)}</Text>
            </View>
          )}
          <View style={styles.summaryTotalRow}>
            <Text>Total Amount:</Text>
            <Text>{formatCurrency(invoice.totalAmount)}</Text>
          </View>
          
          <View style={{ ...styles.summaryRow, marginTop: 8 }}>
            <Text style={styles.label}>Amount Paid:</Text>
            <Text>{formatCurrency(invoice.amountPaid)}</Text>
          </View>
          <View style={{ ...styles.summaryTotalRow, borderTop: 'none' }}>
            <Text>Balance Due:</Text>
            <Text>{formatCurrency(invoice.balance)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for choosing Nidarsanam Health Care.</Text>
          <Text>This is a computer-generated invoice and does not require a physical signature.</Text>
        </View>
      </Page>
    </Document>
  );
}
