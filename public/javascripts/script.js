
<<<<<<< HEAD
function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count = $('#cart-count').html()
                count = parseInt(count)+1
                $("#cart-count").html(count)
            }
        }
    })
}
=======
        function addToCart(proId){
            $.ajax({
                    url:'/add-to-cart/'+proId,
                    method:'get',
                    success:(response)=>{
                        if(response.status){
                            let count = $('#cart-count').html()
                            count = parseInt(count)+1
                            $("#cart-count").html(count)
                        }
                    }
                }
            )}
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
