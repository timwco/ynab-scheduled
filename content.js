console.log('YNAB: Count Scheduled', 'Version 12');


$(document).ready(() => {

  let initialTotal = 0;

  function createBlock(total) {
    const type = (total < 0) ? '-' : '';
    const typeString = (total < 0) ? 'negative' : 'positive';
    const updateTotal = total.toString().replace(/\-/g, '');
    return `
      <i>+</i>
      <div class="accounts-header-balances-uncleared timw-scheduled">
        <div class="accounts-header-balances-label">Scheduled Balance</div>
        <span class="user-data" title="${type}$${updateTotal}">
          <span class="user-data currency ${typeString}">
            ${type}<bdi>$</bdi>${updateTotal}
          </span>
        </span>
      </div>        
    `;
  }

  function updateWorkingBalance(total) {
    const balanceElem = $('.accounts-header-balances-working');
    const balanceElemCurreny = balanceElem.find('.user-data.currency');

    const newBalance = initialTotal + Number(total);

    const type = (newBalance < 0) ? '-' : '';
    const typeString = (newBalance < 0) ? 'negative' : 'positive';
    const updateTotal = newBalance.toLocaleString().replace(/\-/g, ''); 

    balanceElemCurreny.removeClass('negative').removeClass('positive');
    balanceElemCurreny.addClass(typeString);

    balanceElemCurreny.empty().html(`
      ${type}<bdi>$</bdi>${updateTotal} 
    `);
  }

  function updateHeader(total) {
    const beforeElem = $('.accounts-header-balances-uncleared');
    const newElem = $('.timw-scheduled');
    if (newElem.length) {
      newElem.prev().remove();
      newElem.remove();
    }
    beforeElem.after(createBlock(total))
    updateWorkingBalance(total);
  }

  function checkScheduled() {
    const scheduled = $('div.is-scheduled');
    let totalAmount = 0;
    let subtracted = 0;
    let added = 0;

    scheduled.each((i, elem) => {
      const outflow = $(elem).find('.ynab-grid-cell.ynab-grid-cell-outflow.user-data');
      const outflowVal = outflow.find('.currency').text().replace(/\$/g, '');

      const inflow = $(elem).find('.ynab-grid-cell.ynab-grid-cell-inflow.user-data');
      const inflowVal = inflow.find('.currency').text().replace(/\$/g, '');

      subtracted += Number(outflowVal);
      added += Number(inflowVal);

    });

    totalAmount = (added - subtracted).toFixed(2);
    return totalAmount;
  }

  function setInitial() {
    const balanceElem = $('.accounts-header-balances-working');
    if (balanceElem.length) {
      const balanceElemCurreny = balanceElem.find('.user-data.currency');    
      const balanceBefore = balanceElemCurreny.text();
      const balanceBeforeNumber = Number(balanceBefore.replace(/\$/g, '').replace(/\,/g, ''));
      initialTotal = balanceBeforeNumber; 
    } else {
      initialTotal = 0;
    }
  }
  
  setInterval(() => {
    console.log('Running Scheduled Counter...');
    if (initialTotal === 0) setInitial();
    const total = checkScheduled();
    updateHeader(total);
  }, 2000);  

}); 


